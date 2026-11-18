import {useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {computeElapsedMs} from '../redux/liveTimerSlice';
import {getActiveTimers} from '../services/timerApi';
import {subscribeJob, unsubscribeJob} from '../services/timerSocket';
import {TIMER_POLL_MS} from '../config/timerConfig';

/** Re-renders every second so clocks tick. The time itself always comes from server data. */
export const useTick = (enabled = true, ms = 1000) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!enabled) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [enabled, ms]);
  return now;
};

/**
 * Live timers for a job (or all timers when jobId is omitted), each with elapsedMs.
 * While the screen is open: joins the job room and polls GET /timers/active every 30 s as a backstop.
 */
export const useLiveTimers = jobId => {
  const timersById = useSelector(s => s.liveTimers.timers);
  const clockOffset = useSelector(s => s.liveTimers.clockOffset);
  const connection = useSelector(s => s.liveTimers.connection);
  const focused = useIsFocused();
  const now = useTick(focused);

  useEffect(() => {
    if (jobId == null || !focused) return undefined;
    subscribeJob(jobId);
    getActiveTimers(jobId).catch(() => {});
    const id = setInterval(() => getActiveTimers(jobId).catch(() => {}), TIMER_POLL_MS);
    return () => {
      clearInterval(id);
      unsubscribeJob(jobId);
    };
  }, [jobId, focused]);

  const timers = useMemo(
    () =>
      Object.values(timersById)
        .filter(t => jobId == null || String(t.jobId) === String(jobId))
        .map(t => ({...t, elapsedMs: computeElapsedMs(t, clockOffset, now)})),
    [timersById, clockOffset, now, jobId],
  );

  return {timers, connection, clockOffset, now};
};

/** The logged-in user's own running or paused timer (optionally for one job). */
export const useMyTimer = jobId => {
  const user = useSelector(s => s.user.user);
  const {timers, connection} = useLiveTimers(jobId);
  const mine = timers.find(
    t =>
      (t.kind === 'lead' && user?.lead_labor?.id != null && t.personId === user.lead_labor.id) ||
      (t.kind === 'labor' && user?.labor?.id != null && t.personId === user.labor.id),
  );
  return {timer: mine || null, timers, connection};
};
