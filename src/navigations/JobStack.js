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
import TimeSheetScreen from '../screens/TimeSheetScreen';
import BluesheetSubmission from '../screens/BluesheetSubmission';
import OrderProducts from '../screens/OrderProducts';

const Stack = createStackNavigator();

export default function JobStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="JobScreen" component={JobScreen} />
      <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
      <Stack.Screen name="JobDetail" component={JobDetail} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="TimeSheetScreen" component={TimeSheetScreen} />
      <Stack.Screen
        name="BluesheetSubmission"
        component={BluesheetSubmission}
      />
      <Stack.Screen name="OrderProducts" component={OrderProducts} />

      <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />
    </Stack.Navigator>
  );
}
