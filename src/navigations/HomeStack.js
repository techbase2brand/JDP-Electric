import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import JobStack from "./JobStack";
import CreateJobScreen from "../screens/CreateJobScreen";
import ReportsScreen from "../screens/ReportsScreen";
import NotificationScreen from "../screens/NotificationScreen";
import SupportScreen from "../screens/SupportScreen";
import JobDetail from "../screens/JobDetail";
import TimeSheetScreen from "../screens/TimeSheetScreen";
import MapScreen from "../screens/MapScreen";

const Stack = createStackNavigator();

export default function HomeStack() {
 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="JobStack" component={JobStack} />
      <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />
      <Stack.Screen name="ReportsScreen" component={ReportsScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen name="JobDetail" component={JobDetail} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="TimeSheetScreen" component={TimeSheetScreen} />



    </Stack.Navigator>
  );
}
