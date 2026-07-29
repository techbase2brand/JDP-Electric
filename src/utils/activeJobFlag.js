import AsyncStorage from '@react-native-async-storage/async-storage';
import {hasActiveLiveActivity} from '../services/LiveActivityService';

// If a locally-stored "started_at" timestamp is older than this, and we
// can't otherwise confirm a Live Activity is really running, treat the
// active-job flag as stale (e.g. leftover from a full device power-off).
const STALE_AFTER_MS = 16 * 60 * 60 * 1000; // 16 hours

// Decides whether the locally-persisted "another job is running" flag
// should be trusted, or is a stale leftover from before a full device
// power-off (which ends Live Activities at the OS level but never touches
// our AsyncStorage flag).
export const isActiveJobFlagStale = async () => {
  const liveActivityRunning = await hasActiveLiveActivity();
  if (liveActivityRunning === true) return false;
  if (liveActivityRunning === false) return true;

  // Native check was inconclusive (Android, older iOS, etc.) — fall back
  // to a coarse timestamp check as a safety net.
  const startedAt = await AsyncStorage.getItem('activeJobStartedAt');
  if (!startedAt) return false;
  const elapsed = Date.now() - Number(startedAt);
  return Number.isFinite(elapsed) && elapsed > STALE_AFTER_MS;
};

export const clearStaleActiveJobFlag = async () => {
  await AsyncStorage.removeItem('activeJobId');
  await AsyncStorage.removeItem('activeJobName');
  await AsyncStorage.removeItem('activeJobAddress');
  await AsyncStorage.removeItem('activeJobStartedAt');
};
