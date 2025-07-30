import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ReportsScreen from "../screens/ReportsScreen";

const Stack = createStackNavigator();

export default function ReportsStack() {
 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportsScreen" component={ReportsScreen} />
    </Stack.Navigator>
  );
}
