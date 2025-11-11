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

import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  SafeAreaView,
  View,
  PermissionsAndroid,
} from 'react-native';
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

// ✅ Redux imports
import {Provider, useDispatch, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/redux/store';
import FloatingTimer from './src/components/FloatingTimer';
import {
  startBackgroundTimer,
  stopBackgroundTimer,
} from './src/NotificationService';
import {logout} from './src/redux/userSlice';
import {logoutApi} from './src/config/apiConfig';

const {flex} = BaseStyle;

const AppContent = () => {
  // const {DynamicIslandModule} = NativeModules;
  const navigationRef = useRef();
  useEffect(() => {
    // (async () => {
    //   try {
    //     const res = await HelloModule.testCall();
    //     console.log("✅ Native response:", res);
    //   } catch (err) {
    //     console.error("❌ Native error:", err);
    //   }
    // })();
    //   if (Platform.OS === "ios" && DynamicIslandModule) {
    //   console.log("👉 Calling Native startTimer",true);
    //   DynamicIslandModule.startTimer(true);
    // }
  }, []);
  //  console.log('Native Modules:', NativeModules);  // Check if your module is listed
  // console.log('DynamicIslandModule:',CalendarModule);
  // DynamicIslandModule.showDynamicIsland(message => {
  //   console.log(message);
  // });
  const userData = useSelector(state => state.user.token);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const token = useSelector(state => state.user.token);
  const {isRunning} = useSelector((state: any) => state.timer);
  console.log('useruser', user, token);

  useEffect(() => {
    if (isRunning) {
      console.log('Starting background timer', isRunning);
      startBackgroundTimer(); // will run only in foreground on iOS simulator
    } else {
      console.log('Stopping background timer');
      stopBackgroundTimer();
    }
  }, [isRunning]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogout = async () => {
    try {
      if (token) {
        await logoutApi(token);
      }
      dispatch(logout());
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
    };
    requestPermissions();
  }, []);
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
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
          getFcmToken();
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
          Alert.alert(
            'Permission Denied',
            'You will not receive notifications.',
          );
        }
      } catch (err) {
        console.warn('Permission error:', err);
      }
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
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
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
      console.log('New FCM token:', token);
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
        <NavigationContainer ref={navigationRef}>
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
