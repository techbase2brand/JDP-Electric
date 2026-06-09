import {NativeModules, Platform} from 'react-native';

const TimerModule = NativeModules?.TimerModule;

export const LOCATION_OFF_LIVE_MESSAGE =
  'Turn on Location to resume timer';

export const endLiveActivity = async () => {
  if (Platform.OS !== 'ios' || !TimerModule?.endActivity) return;
  try {
    await TimerModule.endActivity();
  } catch (e) {
    console.warn('endLiveActivity:', e?.message);
  }
};

export const startLiveActivity = async (elapsedMs, jobName) => {
  if (Platform.OS !== 'ios' || !TimerModule?.startActivity) return;
  try {
    await endLiveActivity();
    const elapsedSec = Math.floor((elapsedMs || 0) / 1000);
    await TimerModule.startActivity(elapsedSec, jobName || 'Work');
  } catch (e) {
    console.warn('startLiveActivity:', e?.message);
  }
};

export const updateLiveActivity = (
  elapsedMs,
  isRunning,
  statusMessage = '',
) => {
  if (Platform.OS !== 'ios' || !TimerModule?.updateActivity) return;
  try {
    const elapsedSec = Math.floor((elapsedMs || 0) / 1000);
    TimerModule.updateActivity(
      elapsedSec,
      !!isRunning,
      statusMessage || '',
    );
  } catch (e) {
    console.warn('updateLiveActivity:', e?.message);
  }
};
