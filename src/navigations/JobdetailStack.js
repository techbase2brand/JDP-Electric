import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CreateJobScreen from "../screens/CreateJobScreen";
import JobDetail from "../screens/JobDetail";
import MapScreen from "../screens/MapScreen";
import TimeSheetScreen from "../screens/TimeSheetScreen";

const Stack = createStackNavigator();

export default function JobdetailStack() {
 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobDetail" component={JobDetail} />
      <Stack.Screen name="TimeSheetScreen" component={TimeSheetScreen} />
      <Stack.Screen name="JobDetail" component={JobDetail} />
      <Stack.Screen name="MapScreen" component={MapScreen} />

      <Stack.Screen name="CreateJobScreen" component={CreateJobScreen} />


    </Stack.Navigator>
  );
}
