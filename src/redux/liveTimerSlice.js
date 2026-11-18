import {createSlice} from '@reduxjs/toolkit';

/**
 * Server-driven timers. The server is the source of truth; the phone only ticks a clock
 * computed from server data:
 *   clockOffset = serverNow - Date.now()   (updated on every response / event)
 *   elapsed = (paused ? pausedAt : Date.now() + clockOffset) - startedAt - pausedMs
 * Never keep a local counter.
 */
const initialState = {
  timers: {}, // by timer id
  clockOffset: 0,
  connection: 'disconnected', // 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
  lastSyncAt: null,
};

const liveTimerSlice = createSlice({
  name: 'liveTimers',
  initialState,
  reducers: {
    // jobId given: replace only that job's timers; otherwise replace everything.
    setTimers: (state, {payload: {timers, jobId}}) => {
      const next = {};
      if (jobId != null) {
        Object.values(state.timers).forEach(t => {
          if (String(t.jobId) !== String(jobId)) next[t.id] = t;
        });
      }
      (timers || []).forEach(t => {
        next[t.id] = t;
      });
      state.timers = next;
      state.lastSyncAt = Date.now();
    },
    upsertTimer: (state, {payload}) => {
      if (payload?.id != null) state.timers[payload.id] = payload;
    },
    removeTimer: (state, {payload}) => {
      delete state.timers[payload];
    },
    setClockOffset: (state, {payload}) => {
      if (Number.isFinite(payload)) state.clockOffset = payload;
    },
    setConnection: (state, {payload}) => {
      state.connection = payload;
    },
    clearLiveTimers: () => initialState,
  },
});

export const {setTimers, upsertTimer, removeTimer, setClockOffset, setConnection, clearLiveTimers} =
  liveTimerSlice.actions;

/** Elapsed ms of a timer right now, from server data. */
export const computeElapsedMs = (timer, clockOffset = 0, now = Date.now()) => {
  if (!timer) return 0;
  const end = timer.status === 'paused' && timer.pausedAt ? timer.pausedAt : now + clockOffset;
  return Math.max(0, end - timer.startedAt - (timer.pausedMs || 0));
};

export const formatHMS = ms => {
  const s = Math.max(0, Math.floor((ms || 0) / 1000));
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
};

export default liveTimerSlice.reducer;
