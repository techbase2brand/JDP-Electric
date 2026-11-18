import {useEffect, useRef} from 'react';
import {Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from '../redux/store';
import {computeElapsedMs} from '../redux/liveTimerSlice';
import {syncServerTimer, stopTimerWithBackground} from '../redux/timerSlice';
import {findMyTimer} from '../utils/myTimer';
import {
  persistTimerState,
  setTimerJobName,
  cancelTimerNotification,
} from '../services/TimerNotificationService';
import {
  startLiveActivity,
  updateLiveActivity,
  endLiveActivity,
  hasActiveLiveActivity,
} from '../services/LiveActivityService';

/**
 * Keeps the app's existing timer state (Redux `timer`, notification, Live Activity, "active job"
 * flags used by Home and Job Detail) in line with the user's own timer from the server.
 * The server is the source of truth: a timer started or stopped on another phone or the web,
 * or after the app was killed, shows up here.
 */
const clearActiveJobKeys = async () => {
  await AsyncStorage.multiRemove([
    'activeJobId',
    'activeJobName',
    'activeJobAddress',
    'activeJobStartedAt',
  ]);
};

export default function useServerTimerBridge() {
  const dispatch = useDispatch();
  const user = useSelector(s => s.user.user);
  const timers = useSelector(s => s.liveTimers.timers);
  const lastSyncAt = useSelector(s => s.liveTimers.lastSyncAt);
  const localActive = useSelector(s => s.timer.isRunning || s.timer.elapsedTime > 0);
  const mine = findMyTimer(timers, user);
  const key = mine
    ? `${mine.id}|${mine.status}|${mine.startedAt}|${mine.pausedAt}|${mine.pausedMs}`
    : 'none';
  const hadTimer = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (mine) {
        hadTimer.current = true;
        const offset = store.getState().liveTimers.clockOffset;
        const elapsedMs = computeElapsedMs(mine, offset);
        const running = mine.status === 'running';
        const name = mine.jobTitle || 'Work';
        dispatch(syncServerTimer({isRunning: running, elapsedMs}));
        await AsyncStorage.setItem('activeJobId', String(mine.jobId));
        await AsyncStorage.setItem('activeJobName', name);
        await AsyncStorage.setItem('activeJobStartedAt', String(mine.startedAt));
        const address = (await AsyncStorage.getItem('activeJobAddress')) || '';
        await AsyncStorage.setItem(
          'lastTimerJob',
          JSON.stringify({id: mine.jobId, name, address}),
        );
        await setTimerJobName(name);
        await persistTimerState(elapsedMs, running, name);
        if (Platform.OS === 'ios' && !cancelled) {
          try {
            if (running && (await hasActiveLiveActivity()) === false) {
              await startLiveActivity(elapsedMs, name);
            }
            updateLiveActivity(elapsedMs, running, '');
          } catch {}
        }
      } else if (lastSyncAt && (hadTimer.current || localActive)) {
        // the server has no timer for this user any more (stopped here, on another phone, or on the web)
        hadTimer.current = false;
        dispatch(stopTimerWithBackground());
        await clearActiveJobKeys();
        await persistTimerState(0, false, '');
        try {
          await endLiveActivity();
          await cancelTimerNotification();
        } catch {}
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, lastSyncAt]);
}
