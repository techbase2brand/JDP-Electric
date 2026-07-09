import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistor} from '../redux/store';
import {logout} from '../redux/userSlice';
import {clearCart} from '../redux/cartSlice';
import {setUnreadCount} from '../redux/notificationSlice';
import {stopTimerWithBackground} from '../redux/timerSlice';
import {logoutApi} from '../config/apiConfig';
import {cancelTimerNotification, persistTimerState} from '../services/TimerNotificationService';
import {stopBackgroundTimer} from '../NotificationService';
import {stopLocationTimerGuard, resetLocationTimerGuard} from '../services/locationTimerGuard';
import {endLiveActivity} from '../services/LiveActivityService';
import notifee from '@notifee/react-native';

export const ONBOARDING_STORAGE_KEY = 'hasLaunched';

export async function cleanupTimerOnSessionEnd(dispatch) {
  try {
    dispatch(stopTimerWithBackground());
    stopBackgroundTimer();
    stopLocationTimerGuard();
    resetLocationTimerGuard();
    await persistTimerState(0, false, '');
    await cancelTimerNotification();
    await endLiveActivity();
  } catch (e) {
    console.log('Timer cleanup on logout failed:', e);
  }
}

export async function clearLocalStorageExceptOnboarding() {
  const keys = await AsyncStorage.getAllKeys();
  const toRemove = keys.filter(k => k !== ONBOARDING_STORAGE_KEY);
  if (toRemove.length) {
    await AsyncStorage.multiRemove(toRemove);
  }
}

export async function performLogout({
  token,
  dispatch,
  skipServerLogout = false,
} = {}) {
  if (!skipServerLogout && token) {
    try {
      await logoutApi(token);
    } catch (e) {
      console.log('logoutApi failed, continuing local logout:', e);
    }
  }

  await cleanupTimerOnSessionEnd(dispatch);

  dispatch(logout());
  dispatch(clearCart());
  dispatch(setUnreadCount(0));

  try {
    await notifee.setBadgeCount(0);
  } catch (e) {
    console.log('Badge clear on logout failed:', e);
  }

  await persistor.purge();
  await clearLocalStorageExceptOnboarding();
}
