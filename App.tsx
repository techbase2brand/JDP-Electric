import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { whiteColor } from './src/constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './src/utils';
import { BaseStyle } from './src/constants/Style';
import SplashScreen from './src/screens/SplashScreen';
import AuthStack from './src/navigations/AuthStack';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './src/navigations/MainTabNavigator';

const { flex, alignItemsCenter, alignJustifyCenter } = BaseStyle;

function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a splash screen timeout
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide splash screen after 3 seconds
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={[flex, { backgroundColor: whiteColor }]}>
      <KeyboardAvoidingView
        style={{
          height:
            Platform.OS === 'ios'
              ? hp(93)
              : hp(100)
        }}
      >
        <NavigationContainer>
          {isLoading ? <SplashScreen /> : <AuthStack />}
        </NavigationContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});

export default App;
