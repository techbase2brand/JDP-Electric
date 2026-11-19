import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../redux/store';
import {
  setClockOffset,
  upsertTimer,
  removeTimer,
  setTimers,
  setPendingActions,
} from '../redux/liveTimerSlice';
import {TIMER_API_URL, TIMER_EXTRA_HEADERS} from '../config/timerConfig';

/**
 * REST client for the real-time timer backend.
 * All calls use the app's JWT. Every response carries serverNow, which updates the clock offset.
 * Pause / resume / stop go through REST (never the socket).
 */
const http = axios.create({
  baseURL: TIMER_API_URL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json', ...TIMER_EXTRA_HEADERS},
});

/** TEMPORARY debug log (one JSON line per event). Remove once the timer timing is confirmed. */
export const timerDebug = (event, data = {}) =>
  console.log('[TIMER-DEBUG]', JSON.stringify({event, time: new Date().toISOString(), ...data}));

const request = async (method, path, {body, params} = {}) => {
  const token = store.getState()?.user?.token;
  const sentAt = Date.now();
  const dbg = {
    action: path.replace('/timers/', ''),
    timerId: body?.timerId ?? null,
    jobId: body?.jobId ?? params?.jobId ?? null,
    at: body?.at ?? null,
    sentAt: new Date(sentAt).toISOString(),
  };
  try {
    const res = await http.request({
      method,
      url: path,
      data: body,
      params,
      headers: {Authorization: `Bearer ${token}`},
    });
    const b = res.data || {};
    timerDebug('response', {
      ...dbg,
      status: res.status,
      receivedAt: new Date().toISOString(),
      ms: Date.now() - sentAt,
    });
    if (Number.isFinite(b.serverNow)) {
      // assume the server stamped serverNow halfway through the round trip
      const mid = (sentAt + Date.now()) / 2;
      store.dispatch(setClockOffset(b.serverNow - mid));
    }
    return b;
  } catch (e) {
    timerDebug('response', {
      ...dbg,
      status: e.response?.status ?? 'no response',
      error: e.response?.data?.message || e.message,
      receivedAt: new Date().toISOString(),
      ms: Date.now() - sentAt,
    });
    if (e.response) {
      const err = new Error(e.response.data?.message || e.message || 'Request failed');
      err.status = e.response.status;
      err.data = e.response.data;
      throw err;
    }
    const err = new Error('No internet connection. Please try again.');
    err.status = 0;
    err.isNetwork = true;
    throw err;
  }
};

/** Start a timer. Lead labour can pass laborId to start one for a labourer. 409 = already running elsewhere. */
export const startTimer = async ({jobId, laborId, leadLaborId, at} = {}) => {
  const b = await request('post', '/timers/start', {body: {jobId, laborId, leadLaborId, at}});
  if (b.data) store.dispatch(upsertTimer(b.data));
  return b.data;
};

export const pauseTimer = async ({timerId, title, note, reason, at} = {}) => {
  const b = await request('post', '/timers/pause', {body: {timerId, title, note, reason, at}});
  if (b.data) store.dispatch(upsertTimer(b.data));
  return b.data;
};

export const resumeTimer = async ({timerId, at} = {}) => {
  const b = await request('post', '/timers/resume', {body: {timerId, at}});
  if (b.data) store.dispatch(upsertTimer(b.data));
  return b.data;
};

/** Stop saves the timesheet on the server. Response data.timesheet.id is the saved timesheet. */
export const stopTimer = async ({timerId, markCompleted, at} = {}) => {
  try {
    const b = await request('post', '/timers/stop', {body: {timerId, markCompleted, at}});
    store.dispatch(removeTimer(timerId));
    return b.data;
  } catch (e) {
    // 404 after a stop that already happened = done
    if (e.status === 404) {
      store.dispatch(removeTimer(timerId));
      return {alreadyStopped: true};
    }
    throw e;
  }
};

/** All running or paused timers (optionally only one job). Rebuilds the store from the server. */
export const getActiveTimers = async jobId => {
  const b = await request('get', '/timers/active', {params: jobId != null ? {jobId} : undefined});
  const list = Array.isArray(b.data) ? b.data : b.data?.timers || [];
  store.dispatch(setTimers({timers: list, jobId}));
  return list;
};

// ---------------------------------------------------------------- offline queue
// No internet: actions are saved with the phone's time ("at") and replayed in order when the
// network is back. The server clamps "at" (not future, not older than 48 h, not before the
// previous action) and duplicate calls are safe.
const QUEUE_KEY = 'timer_action_queue';
let flushing = false;

const readQueue = async () => {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const writeQueue = q => AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(q)).catch(() => {});

export const getQueuedActionCount = async () => (await readQueue()).length;

/** Re-read the saved queue and update the "not synced yet" counter. */
export const refreshPendingCount = async () =>
  store.dispatch(setPendingActions(await getQueuedActionCount()));

const send = (type, payload, at) => {
  switch (type) {
    case 'start':
      return startTimer({...payload, at});
    case 'pause':
      return pauseTimer({...payload, at});
    case 'resume':
      return resumeTimer({...payload, at});
    case 'stop':
      return stopTimer({...payload, at});
    default:
      return Promise.resolve(null);
  }
};

/**
 * Do a timer action. Online: normal REST call, returns the result.
 * No network: the action is queued and {queued: true, localId} is returned so the UI can show
 * "will sync when online". Server errors (409, 403...) are thrown as usual.
 */
export const runTimerAction = async (type, payload = {}) => {
  try {
    return await send(type, payload);
  } catch (e) {
    if (!e.isNetwork) throw e;
    const q = await readQueue();
    const localId = type === 'start' ? `local:${Date.now()}` : undefined;
    q.push({type, payload, at: Date.now(), localId});
    await writeQueue(q);
    store.dispatch(setPendingActions(q.length));
    timerDebug('queued', {action: type, timerId: payload?.timerId ?? null, at: q[q.length - 1].at, waiting: q.length});
    return {queued: true, localId};
  }
};

/** Replay queued actions in order. Safe to call often (on reconnect, on app foreground). */
export const flushTimerQueue = async () => {
  if (flushing) return {sent: 0, left: (await readQueue()).length};
  flushing = true;
  let sent = 0;
  try {
    const q = await readQueue();
    const idMap = {}; // local start id -> real timer id
    while (q.length) {
      const item = q[0];
      const payload = {...item.payload};
      if (payload.timerId && idMap[payload.timerId]) payload.timerId = idMap[payload.timerId];
      try {
        const result = await send(item.type, payload, item.at);
        if (item.type === 'start' && item.localId && result?.id != null) idMap[item.localId] = result.id;
        q.shift();
        sent += 1;
      } catch (e) {
        if (e.isNetwork) break; // still offline, keep the rest
        console.log('timer queue: dropping action', item.type, e.status, e.message);
        q.shift(); // server rejected it (409/403/404...): retrying will not help
      }
      await writeQueue(q);
    }
    await writeQueue(q);
    store.dispatch(setPendingActions(q.length));
    if (sent) timerDebug('queue-flushed', {sent, left: q.length});
    return {sent, left: q.length};
  } finally {
    flushing = false;
  }
};
