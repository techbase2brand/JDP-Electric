import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import JobStack from './JobStack';
import CreateJobScreen from '../screens/CreateJobScreen';
import ReportsScreen from '../screens/ReportsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SupportScreen from '../screens/SupportScreen';
import JobDetail from '../screens/JobDetail';
import MapScreen from '../screens/MapScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import WarrantyChecker from '../screens/WarrantyChecker';
import ProfileScreen from '../screens/ProfileScreen';
import BluesheetSubmission from '../screens/BluesheetSubmission';
import OrderProducts from '../screens/OrderProducts';
import TimerScreen from '../screens/TimerScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import JobsScreen from '../screens/JobScreen';
import ActivitySummaryScreen from '../screens/ActivitySummaryScreen';
import JobTimesheet from '../screens/JobTimeSheet';
import SupplierSelectionScreen from '../screens/SupplierSelectionScreen';
import JobActivityLogScreen from '../screens/JobActivityLogScreen';
import TimeSheetStack from './TimeSheetStack';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="JobStack" component={JobsScreen} />
      <Stack.Screen name="JobTimesheet" component={JobTimesheet} />
      <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />
      <Stack.Screen name="ActivitySummaryScreen" component={ActivitySummaryScreen} />
      <Stack.Screen name="ReportsScreen" component={ReportsScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen name="JobDetail" component={JobDetail} options={{ tabBarStyle: { display: 'none' } }} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="BluesheetSubmission" component={BluesheetSubmission} />
      <Stack.Screen name="OrderProducts" component={OrderProducts} />
      <Stack.Screen name="JobActivityLogScreen" component={JobActivityLogScreen} />
      <Stack.Screen name="SupplierSelectionScreen" component={SupplierSelectionScreen} />
      <Stack.Screen name="OrderConfirmationScreen" component={OrderConfirmationScreen} />
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
        <Stack.Screen name="TimeSheetStack" component={TimeSheetStack} />

      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="TimerScreen" component={TimerScreen} />
      <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="WarrantyChecker" component={WarrantyChecker} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
}
