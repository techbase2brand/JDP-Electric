/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-url-polyfill/auto';
import messaging from '@react-native-firebase/messaging';
import {
  getPersistedTimerState,
  updateTimerNotification,
} from './src/services/TimerNotificationService';

if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = require('react-native/Libraries/WebSocket/WebSocket');
}

// Android: foreground service for timer notification (updates every second when app in background)
notifee.registerForegroundService((notification) => {
  return new Promise((resolve) => {
    const intervalId = setInterval(async () => {
      try {
        const state = await getPersistedTimerState();
        if (!state.isRunning) {
          clearInterval(intervalId);
          await notifee.stopForegroundService();
          resolve();
          return;
        }
        await updateTimerNotification(
          state.elapsedSec,
          state.isRunning,
          state.jobName,
        );
      } catch (e) {
        // ignore
      }
    }, 1000);
  });
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
