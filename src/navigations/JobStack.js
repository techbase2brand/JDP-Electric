import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
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
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

export default function JobStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="JobStack" component={JobScreen} />
      <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
      <Stack.Screen name="JobDetail" component={JobDetail} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="TimerScreen" component={TimerScreen} />
      <Stack.Screen
        name="BluesheetSubmission"
        component={BluesheetSubmission}
      />
      <Stack.Screen name="OrderProducts" component={OrderProducts} />
      <Stack.Screen
        name="OrderConfirmationScreen"
        component={OrderConfirmationScreen}
      />
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}
