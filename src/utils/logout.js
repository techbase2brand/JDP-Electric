import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistor} from '../redux/store';
import {logout} from '../redux/userSlice';
import {clearCart} from '../redux/cartSlice';
import {stopTimerWithBackground} from '../redux/timerSlice';
import {logoutApi} from '../config/apiConfig';
import {cancelTimerNotification} from '../services/TimerNotificationService';
import {stopBackgroundTimer} from '../NotificationService';
import {stopLocationTimerGuard} from '../services/locationTimerGuard';

export const ONBOARDING_STORAGE_KEY = 'hasLaunched';

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

  try {
    dispatch(stopTimerWithBackground());
    stopBackgroundTimer();
    stopLocationTimerGuard();
    await cancelTimerNotification();
  } catch (e) {
    console.log('Timer cleanup on logout failed:', e);
  }

  dispatch(logout());
  dispatch(clearCart());

  await persistor.purge();
  await clearLocalStorageExceptOnboarding();
}
