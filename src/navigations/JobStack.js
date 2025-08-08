import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import JobScreen from '../screens/JobScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import CreateJobScreen from '../screens/CreateJobScreen';
import JobDetail from '../screens/JobDetail';
import MapScreen from '../screens/MapScreen';
import BluesheetSubmission from '../screens/BluesheetSubmission';
import OrderProducts from '../screens/OrderProducts';
import TimerScreen from '../screens/TimerScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

const Stack = createStackNavigator();

export default function JobStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="JobScreen" component={JobScreen} />
      <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
      <Stack.Screen name="JobDetail" component={JobDetail} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="TimerScreen" component={TimerScreen} />
      <Stack.Screen
        name="BluesheetSubmission"
        component={BluesheetSubmission}
      />
      <Stack.Screen name="OrderProducts" component={OrderProducts} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />
    </Stack.Navigator>
  );
}
