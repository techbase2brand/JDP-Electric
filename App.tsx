// import React, { useEffect, useState } from 'react';
// import { KeyboardAvoidingView, Platform, SafeAreaView, } from 'react-native';
// import { whiteColor } from './src/constants/Color';
// import { heightPercentageToDP as hp } from './src/utils';
// import { BaseStyle } from './src/constants/Style';
// import SplashScreen from './src/screens/SplashScreen';
// import AuthStack from './src/navigations/AuthStack';
// import { NavigationContainer } from '@react-navigation/native';
// import MainTabNavigator from './src/navigations/MainTabNavigator';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Provider, useSelector } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from './src/redux/store';

// const { flex, } = BaseStyle;

// function App(): React.JSX.Element {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // add this

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);
//   useEffect(() => {
//     const checkLogin = async () => {
//       const loginStatus = await AsyncStorage.getItem('isLoggedIn');
//       setIsLoggedIn(loginStatus === 'true');
//       // setIsLoading(false);
//     };

//     checkLogin();
//   }, []);

//   return (
//     <SafeAreaView style={[flex, { backgroundColor: whiteColor }]}>
//       <KeyboardAvoidingView
//         style={{
//           height:
//             Platform.OS === 'ios'
//               ? hp(94.7)
//               : hp(100)
//         }}
//       >
//         <NavigationContainer>
//           {isLoading ? (
//             <SplashScreen />
//           ) : isLoggedIn ? (
//             <MainTabNavigator />
//           ) : (
//             <AuthStack />
//           )}
//         </NavigationContainer>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// export default App;

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  AppState,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  SafeAreaView,
  View,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {whiteColor} from './src/constants/Color';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from './src/utils';
import {BaseStyle} from './src/constants/Style';
import SplashScreen from './src/screens/SplashScreen';
import AuthStack from './src/navigations/AuthStack';
import MainTabNavigator from './src/navigations/MainTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-get-random-values';
import messaging from '@react-native-firebase/messaging';

//  Redux imports
import {Provider, useDispatch, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/redux/store';
import FloatingTimer from './src/components/FloatingTimer';
import notifee from '@notifee/react-native';
import {
  startBackgroundTimer,
  stopBackgroundTimer,
} from './src/NotificationService';
import {
  persistTimerState,
  showTimerNotification,
  getPersistedTimerState,
  updateTimerNotification,
  cancelTimerNotification,
} from './src/services/TimerNotificationService';
import {logout} from './src/redux/userSlice';
import {logoutApi} from './src/config/apiConfig';
import {useNotifications} from './src/hooks/useNotifications';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import crashlytics from '@react-native-firebase/crashlytics';
const {flex} = BaseStyle;
const AppContent = () => {
  const navigationRef = useRef();
  const [navReady, setNavReady] = useState(false);
  const [pendingLink, setPendingLink] = useState(null);
  const userData = useSelector(state => state.user.token);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const token = useSelector(state => state.user.token);
  const {isRunning, elapsedTime} = useSelector((state: any) => state.timer);

  // console.log('useruser', user, token, isRunning, elapsedTime);
  const userId = user?.id;

  const {unreadCount} = useNotifications(userId);
  useEffect(() => {
    if (user !== null) {
      updateBadge(unreadCount);
    }
  }, [unreadCount]);
  const updateBadge = async count => {
    try {
      await notifee.setBadgeCount(count);
    } catch (e) {
      console.log('Badge update error:', e);
    }
  };

  // Initialize Crashlytics (App Start पर)
  useEffect(() => {
    const initializeCrashlytics = async () => {
      try {
        await crashlytics().setCrashlyticsCollectionEnabled(true);
        console.log('✅ [CRASHLYTICS] Initialized');
      } catch (e) {
        console.log('❌ [CRASHLYTICS] Init Error:', e);
      }
    };

    initializeCrashlytics();
  }, []);

  // 🟦 2️⃣ Set User Data in Crashlytics (Login / Logout)
  useEffect(() => {
    if (user && user.id) {
      console.log('user::::', user);

      try {
        crashlytics().setUserId(String(user.id));

        if (user.email) crashlytics().setAttribute('user_email', user.email);
        if (user.name) crashlytics().setAttribute('user_name', user.full_name);

        console.log('✅ [CRASHLYTICS] User Set:', user.email || user.id);
      } catch (e) {
        console.log('❌ [CRASHLYTICS] User Error:', e);
      }
    } else {
      // logout पर Clear
      try {
        crashlytics().setUserId('');
        crashlytics().setAttribute('user_email', '');
        crashlytics().setAttribute('user_name', '');
      } catch (e) {
        console.log('❌ [CRASHLYTICS] Clear User Error:', e);
      }
    }
  }, [user]);

  // 🟦 3️⃣ Track Screen Name for Crashlytics
  const handleNavigationStateChange = useCallback(() => {
    try {
      if (navigationRef.current) {
        const currentRoute = navigationRef.current.getCurrentRoute();
        if (currentRoute) {
          crashlytics().setAttribute('current_screen', currentRoute.name);
          console.log('📍 [CRASHLYTICS] Screen:', currentRoute.name);
        }
      }
    } catch (e) {
      console.log('❌ [CRASHLYTICS] Screen Tracking Error:', e);
    }
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background state:', remoteMessage);

      handleNavigation(remoteMessage.data);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Opened from quit state:', remoteMessage);
          handleNavigation(remoteMessage.data);
        }
      });
  }, []);

  // const handleNavigation = data => {
  //   if (!data) return;

  //   console.log('datata>>>', data);

  //   const link = data?.custom_link || '';
  //   console.log('link>>>', link);

  //   // agar link "/jobs" se start hota hai
  //   if (link.startsWith('/jobs')) {
  //     navigationRef.current?.navigate('JobStack');
  //   } else {
  //     navigationRef.current?.navigate('NotificationScreen');
  //   }
  // };

  const handleNavigation = data => {
    if (!data) return;

    const link = data?.custom_link || '';
    console.log('link>>>', link);

    // agar navigation ready nahi hai to store kar do
    if (!navReady) {
      console.log('Navigation not ready, storing link');
      setPendingLink(link);
      return;
    }

    navigateFromLink(link);
  };
  const navigateFromLink = link => {
    if (!navigationRef.current) return;

    if (link.startsWith('/jobs')) {
      const jobId = link.split('/')[2];

      // Deep link into Jobs tab → Job list → auto-open detail inside JobScreen
      navigationRef.current.navigate('Jobs', {
        screen: 'JobStack',
        params: {initialJobId: jobId},
      });
    } else {
      navigationRef.current.navigate('NotificationScreen');
    }
  };

  useEffect(() => {
  if (navReady && pendingLink) {
    console.log('Opening pending link:', pendingLink);
    navigateFromLink(pendingLink);
    setPendingLink(null);
  }
}, [navReady, pendingLink]);


  useEffect(() => {
    if (isRunning) {
      console.log('Starting background timer', isRunning);
      startBackgroundTimer(); // will run only in foreground on iOS simulator
    } else {
      console.log('Stopping background timer');
      stopBackgroundTimer();
    }
  }, [isRunning]);

  // Persist + update notification every second when running (sync app ↔ notification)
  const persistIntervalRef = useRef(null);
  useEffect(() => {
    if (!isRunning) {
      if (persistIntervalRef.current) {
        clearInterval(persistIntervalRef.current);
        persistIntervalRef.current = null;
      }
      persistTimerState(elapsedTime, false);
      return;
    }
    const tick = async () => {
      const state = store.getState();
      const t = state?.timer;
      if (!t) return;
      const elapsed = t.elapsedTime ?? 0;
      const running = !!t.isRunning;
      await persistTimerState(elapsed, running);
      // Only update notification when app is in background (don't show card when app is active)
      // iOS: we rely on Live Activity (TimerModule) for lock-screen display.
      // Android: keep updating the foreground-service notification.
      if (Platform.OS === 'android' && appStateRef.current === 'background') {
        const p = await getPersistedTimerState();
        await updateTimerNotification(
          Math.floor(elapsed / 1000),
          running,
          p?.jobName || 'Work',
        );
      }
    };
    tick(); // once now
    persistIntervalRef.current = setInterval(tick, 1000);
    return () => {
      if (persistIntervalRef.current) {
        clearInterval(persistIntervalRef.current);
        persistIntervalRef.current = null;
      }
    };
  }, [isRunning, elapsedTime]);

  // When app goes to background and timer is running, show notification (lock screen / shade).
  // When app comes to active, hide the notification so it doesn't show while user is in app.
  const appStateRef = useRef(AppState.currentState);
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;
      if (prev === 'active' && nextState === 'background') {
        const state = store.getState();
        const running = state?.timer?.isRunning;
        const elapsed = state?.timer?.elapsedTime ?? 0;
        if (running) {
          persistTimerState(elapsed, true);
          const elapsedSec = Math.floor(elapsed / 1000);
          // Android: show foreground-service notification on background.
          // iOS: do not show timer notification; Live Activity handles lock screen.
          if (Platform.OS === 'android') {
            getPersistedTimerState().then(p =>
              showTimerNotification(elapsedSec, true, p?.jobName || 'Work'),
            );
          }
        }
      }
      if (prev === 'background' && nextState === 'active') {
        // Android: hide/stop foreground-service notification when user returns to app.
        // iOS: no timer notification should be shown.
        if (Platform.OS === 'android') {
          cancelTimerNotification();
        }
      }
    });
    return () => sub.remove();
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogout = async () => {
    try {
      if (token) {
        await logoutApi(token);
      }
      dispatch(logout());
      // Clear all persisted local storage except onboarding flag
      const keys = await AsyncStorage.getAllKeys();
      const keepKey = 'hasLaunched';
      const toRemove = keys.filter(k => k !== keepKey);
      if (toRemove.length) await AsyncStorage.multiRemove(toRemove);
      // Alert.alert('Session Expired', 'Please login again.');
    } catch (err) {
      Alert.alert('Logout Failed', err.message || 'Please try again');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const loginStatus = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loginStatus === 'true');
    };
    checkLogin();
  }, []);
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'ios') {
        await requestUserIosPermission();
      } else {
        await requestNotificationPermission();
      }
      await requestLocationPermission();
    };
    requestPermissions();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to verify work location for timer.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          // don't block app; timer screen will handle showing alerts
          console.log('Location permission denied');
        }
        return;
      }

      // iOS
      try {
        Geolocation.requestAuthorization?.('whenInUse');
      } catch {}
    } catch (err) {
      console.warn('Location permission error:', err);
    }
  };
  const requestNotificationPermission = async () => {
    try {
      // Android 13+ → runtime POST_NOTIFICATIONS permission required
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app would like to send you notifications.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted (Android 13+)');
          await getFcmToken();
        } else {
          console.log('Notification permission denied (Android 13+)');
          Alert.alert(
            'Permission Denied',
            'You will not receive notifications.',
          );
        }
        return;
      }

      // Android 12 and below → permission popup nahi hota, direct token le lo
      if (Platform.OS === 'android') {
        console.log('Android < 13, requesting FCM token without notification permission');
        await getFcmToken();
        return;
      }
    } catch (err) {
      console.warn('Permission error:', err);
    }
  };
  const requestUserIosPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('iOS Notification permission granted:', authStatus);
      getFcmToken();
    } else {
      console.log('iOS Notification permission denied:', authStatus);
    }
  };

  useEffect(() => {
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // });
    // return unsubscribe;
  }, []);

  const getFcmToken = async () => {
    try {
      const existingToken = await AsyncStorage.getItem('fcmToken');
      if (existingToken) {
        console.log('FCM token (from storage):', existingToken);
        return existingToken;
      }

      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
        return token;
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };

  return (
    <SafeAreaView style={[flex, {backgroundColor: whiteColor}]}>
      <KeyboardAvoidingView
        style={{
          height: Platform.OS === 'ios' ? hp(94.6) : hp(100),
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            console.log('✅ Navigation Ready');
            setNavReady(true);
          }}
          onStateChange={handleNavigationStateChange}>
          {isLoading ? (
            <SplashScreen />
          ) : userData ? (
            <MainTabNavigator />
          ) : (
            <AuthStack />
          )}

          <FloatingTimer />
        </NavigationContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppContent />
    </PersistGate>
  </Provider>
);

export default App;
