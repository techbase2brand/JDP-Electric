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


import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { whiteColor } from './src/constants/Color';
import { heightPercentageToDP as hp } from './src/utils';
import { BaseStyle } from './src/constants/Style';
import SplashScreen from './src/screens/SplashScreen';
import AuthStack from './src/navigations/AuthStack';
import MainTabNavigator from './src/navigations/MainTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

// ✅ Redux imports
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';

const { flex } = BaseStyle;

const AppContent = () => {
  const userData = useSelector(state => state.user.userData);
console.log("userDatauserData,",userData);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <SafeAreaView style={[flex, { backgroundColor: whiteColor }]}>
      <KeyboardAvoidingView
        style={{
          height: Platform.OS === 'ios' ? hp(94.7) : hp(100),
        }}
      >
        <NavigationContainer>
          {isLoading ? (
            <SplashScreen />
          ) : userData ? (
            <MainTabNavigator />
          ) : (
            <AuthStack />
          )}
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
