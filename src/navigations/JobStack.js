import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import JobScreen from "../screens/JobScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";

const Stack = createStackNavigator();

export default function JobStack() {
 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobScreen" component={JobScreen} />
      <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />

    </Stack.Navigator>
  );
}
