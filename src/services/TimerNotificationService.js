/**
 * Timer notification: lock screen + notification shade when app is in background.
 * Android: Foreground service + updating notification.
 * iOS: Single notification when backgrounded (Live Activity handles lock screen).
 */
import notifee, { AndroidColor } from '@notifee/react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMER_NOTIFICATION_ID = 'work-timer';
const CHANNEL_ID = 'work-timer-channel';
export const TIMER_NOTIF_STORAGE_KEYS = {
  elapsedSec: 'timer_notif_elapsed_sec',
  isRunning: 'timer_notif_running',
  jobName: 'timer_notif_job_name',
};

const STORAGE_KEYS = TIMER_NOTIF_STORAGE_KEYS;

let channelCreated = false;

async function ensureChannel() {
  if (channelCreated) return;
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Work Timer',
    importance: 4, // HIGH
    sound: undefined,
    vibration: false,
  });
  channelCreated = true;
}

function formatHMS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${ss}`;
}

/**
 * Persist current timer state so background/foreground service can read it.
 * Call this from app whenever timer state changes (e.g. from Redux subscriber).
 */
export async function persistTimerState(elapsedMs, isRunning, jobName = '') {
  try {
    const elapsedSec = Math.floor(elapsedMs / 1000);
    await AsyncStorage.setItem(STORAGE_KEYS.elapsedSec, String(elapsedSec));
    await AsyncStorage.setItem(STORAGE_KEYS.isRunning, isRunning ? '1' : '0');
    if (jobName != null && String(jobName).trim() !== '') {
      await AsyncStorage.setItem(STORAGE_KEYS.jobName, String(jobName));
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Show or update the timer notification (body = elapsed time).
 * On Android with asForegroundService: true this starts the foreground service
 * which will keep updating the notification.
 */
export async function showTimerNotification(elapsedSec, isRunning, jobName = 'Work') {
  try {
    if (Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();
      // AUTHORIZED = 1, PROVISIONAL = 2; allow both to show notification
      if (settings?.authorizationStatus < 1) {
        console.warn('TimerNotificationService: iOS notification permission not granted');
        return;
      }
    } else {
      await ensureChannel();
    }
    const title = jobName ? `${jobName} – Timer` : 'Work Timer';
    const body = isRunning
      ? `Elapsed: ${formatHMS(elapsedSec)}`
      : `Paused: ${formatHMS(elapsedSec)}`;

    const notification = {
      id: TIMER_NOTIFICATION_ID,
      title,
      body,
      android: {
        channelId: CHANNEL_ID,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
        ongoing: true,
        autoCancel: false,
      },
    };

    if (Platform.OS === 'android') {
      notification.android.asForegroundService = true;
      notification.android.color = AndroidColor.BLUE;
      notification.android.colorized = true;
    }

    await notifee.displayNotification(notification);
  } catch (e) {
    console.warn('TimerNotificationService show error:', e?.message);
  }
}

/**
 * Update only the notification content (same id). Use from foreground or from service.
 */
export async function updateTimerNotification(elapsedSec, isRunning, jobName = 'Work') {
  try {
    const title = jobName ? `${jobName} – Timer` : 'Work Timer';
    const body = isRunning
      ? `Elapsed: ${formatHMS(elapsedSec)}`
      : `Paused: ${formatHMS(elapsedSec)}`;

    await notifee.displayNotification({
      id: TIMER_NOTIFICATION_ID,
      title,
      body,
      android: {
        channelId: CHANNEL_ID,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
        ongoing: true,
        autoCancel: false,
      },
    });
  } catch (e) {
    // ignore
  }
}

/**
 * Cancel timer notification and (on Android) stop foreground service.
 */
export async function cancelTimerNotification() {
  try {
    if (Platform.OS === 'android') {
      await notifee.stopForegroundService();
    }
    await notifee.cancelNotification(TIMER_NOTIFICATION_ID);
  } catch (e) {
    // ignore
  }
}

/**
 * Read last persisted state (for foreground service loop).
 */
export async function getPersistedTimerState() {
  try {
    const elapsed = await AsyncStorage.getItem(STORAGE_KEYS.elapsedSec);
    const running = await AsyncStorage.getItem(STORAGE_KEYS.isRunning);
    const jobName = await AsyncStorage.getItem(STORAGE_KEYS.jobName);
    return {
      elapsedSec: parseInt(elapsed || '0', 10),
      isRunning: running === '1',
      jobName: jobName || 'Work',
    };
  } catch (e) {
    return { elapsedSec: 0, isRunning: false, jobName: 'Work' };
  }
}

/** Call when user starts timer to show job name in notification. */
export async function setTimerJobName(jobName) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.jobName, String(jobName || 'Work'));
  } catch (e) {
    // ignore
  }
}
