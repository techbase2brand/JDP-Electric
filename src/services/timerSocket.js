import {io} from 'socket.io-client';
import {AppState} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {store} from '../redux/store';
import {
  upsertTimer,
  removeTimer,
  setClockOffset,
  setConnection,
  clearLiveTimers,
} from '../redux/liveTimerSlice';
import {getActiveTimers, flushTimerQueue, refreshPendingCount} from './timerApi';
import {TIMER_ORIGIN, TIMER_EXTRA_HEADERS} from '../config/timerConfig';

/**
 * One shared Socket.IO connection for the whole app.
 * Connect after login, disconnect on logout (see App.tsx). It only pushes changes made by
 * anyone (timer:started / paused / resumed / stopped); actions themselves go through REST.
 */
let socket = null;
let listenersStarted = false;
let appStateSub = null;
let netUnsub = null;
let retryTimer = null;
const jobRooms = new Map(); // jobId -> how many screens use it

const getToken = () => store.getState()?.user?.token;
const dispatch = a => store.dispatch(a);

/** Replay offline actions, then rebuild the timers from the server. */
export const resyncTimers = async () => {
  if (!getToken()) return;
  try {
    await flushTimerQueue();
    await getActiveTimers();
  } catch (e) {
    console.log('timer resync failed:', e?.message);
  }
};

const applyEvent = ({timer, serverNow} = {}) => {
  if (Number.isFinite(serverNow)) dispatch(setClockOffset(serverNow - Date.now()));
  return timer;
};

export const connectTimerSocket = () => {
  if (!getToken()) return;
  if (socket) {
    if (!socket.connected) socket.connect();
    return;
  }
  dispatch(setConnection('connecting'));

  socket = io(TIMER_ORIGIN, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    // If the websocket upgrade is blocked (the production Apache does not proxy websockets yet),
    // fall back to long-polling instead of failing.
    tryAllTransports: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    timeout: 15000,
    extraHeaders: TIMER_EXTRA_HEADERS,
    // read the latest token on every (re)connect
    auth: cb => cb({token: getToken()}),
  });

  socket.on('connect', () => {
    clearTimeout(retryTimer);
    dispatch(setConnection('connected'));
    jobRooms.forEach((_, jobId) => socket.emit('timer:subscribe-job', jobId));
    resyncTimers();
  });

  socket.on('disconnect', reason => {
    if (reason === 'io client disconnect') {
      dispatch(setConnection('disconnected'));
      return;
    }
    dispatch(setConnection('reconnecting'));
    // the server closed the connection: socket.io will not retry by itself
    if (reason === 'io server disconnect') {
      clearTimeout(retryTimer);
      retryTimer = setTimeout(() => socket && socket.connect(), 1000);
    }
  });

  socket.on('connect_error', () => {
    dispatch(setConnection('reconnecting'));
    // token rejected (not retrying automatically): try again in 5 s with the latest token
    if (socket && !socket.active) {
      clearTimeout(retryTimer);
      retryTimer = setTimeout(() => socket && socket.connect(), 5000);
    }
  });

  ['timer:started', 'timer:paused', 'timer:resumed'].forEach(evt =>
    socket.on(evt, payload => {
      const timer = applyEvent(payload);
      if (timer) dispatch(upsertTimer(timer));
    }),
  );
  socket.on('timer:stopped', payload => {
    const timer = applyEvent(payload);
    if (timer?.id != null) dispatch(removeTimer(timer.id));
  });
};

/** Reconnect right away (app back in foreground / network back) and resync. */
export const reconnectNow = () => {
  if (!getToken()) return;
  if (!socket) connectTimerSocket();
  else if (!socket.connected) socket.connect();
  resyncTimers();
};

export const subscribeJob = jobId => {
  if (jobId == null) return;
  const n = jobRooms.get(jobId) || 0;
  jobRooms.set(jobId, n + 1);
  if (n === 0 && socket?.connected) socket.emit('timer:subscribe-job', jobId);
};

export const unsubscribeJob = jobId => {
  const n = (jobRooms.get(jobId) || 0) - 1;
  if (n > 0) {
    jobRooms.set(jobId, n);
    return;
  }
  jobRooms.delete(jobId);
  if (socket?.connected) socket.emit('timer:unsubscribe-job', jobId);
};

/** Call once after login. */
export const startTimerRealtime = () => {
  refreshPendingCount();
  connectTimerSocket();
  if (listenersStarted) return;
  listenersStarted = true;
  appStateSub = AppState.addEventListener('change', s => {
    if (s === 'active') reconnectNow();
  });
  let wasOnline = true;
  netUnsub = NetInfo.addEventListener(state => {
    const online = state.isConnected !== false && state.isInternetReachable !== false;
    if (online && !wasOnline) reconnectNow();
    wasOnline = online;
  });
};

/** Call on logout. */
export const stopTimerRealtime = () => {
  clearTimeout(retryTimer);
  appStateSub?.remove();
  appStateSub = null;
  netUnsub?.();
  netUnsub = null;
  listenersStarted = false;
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  jobRooms.clear();
  dispatch(clearLiveTimers());
};
