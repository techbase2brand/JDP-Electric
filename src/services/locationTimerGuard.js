import {Alert, AppState, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {store} from '../redux/store';
import {pauseTimerWithBackground} from '../redux/timerSlice';
import {
  persistTimerState,
  getPersistedTimerState,
} from './TimerNotificationService';
import {
  updateLiveActivity,
  LOCATION_OFF_LIVE_MESSAGE,
} from './LiveActivityService';
import {showTimerLocationOffNotification} from './TimerNotificationService';

let watchId = null;
let locationPauseHandled = false;
let locationPauseActive = false;

export const isLocationPauseActive = () => locationPauseActive;

const isLocationError = error => {
  const code = error?.code;
  return code === 1 || code === 2 || code === 3;
};

export const resetLocationTimerGuard = () => {
  locationPauseHandled = false;
  locationPauseActive = false;
};

export const clearLocationTimerWatch = () => {
  if (watchId != null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }
};

const notifyUserLocationOff = async elapsedMs => {
  const p = await getPersistedTimerState();
  const jobName = p?.jobName || 'Work';
  const elapsedSec = Math.floor((elapsedMs || 0) / 1000);

  updateLiveActivity(elapsedMs, false, LOCATION_OFF_LIVE_MESSAGE);

  if (AppState.currentState !== 'active') {
    await showTimerLocationOffNotification(elapsedSec, jobName);
  } else {
    Alert.alert(
      'Timer Paused',
      'Location was turned off. Turn on Location Services to resume your work timer.',
    );
  }
};

export const handleTimerPausedDueToLocationOff = async () => {
  if (locationPauseHandled) return;
  const state = store.getState()?.timer;
  if (!state?.isRunning) return;

  locationPauseHandled = true;
  locationPauseActive = true;
  clearLocationTimerWatch();

  const elapsedMs = state.elapsedTime ?? 0;
  store.dispatch(pauseTimerWithBackground());
  const p = await getPersistedTimerState();
  await persistTimerState(elapsedMs, false, p?.jobName || 'Work');
  await notifyUserLocationOff(elapsedMs);
};

export const startLocationTimerGuard = () => {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
  clearLocationTimerWatch();
  locationPauseHandled = false;

  watchId = Geolocation.watchPosition(
    () => {
      // Position OK while timer is running — allow detecting a future location drop
      locationPauseHandled = false;
    },
    error => {
      if (isLocationError(error)) {
        handleTimerPausedDueToLocationOff();
      }
    },
    {enableHighAccuracy: true, distanceFilter: 25, interval: 8000},
  );
};

export const stopLocationTimerGuard = () => {
  clearLocationTimerWatch();
  locationPauseHandled = false;
};
