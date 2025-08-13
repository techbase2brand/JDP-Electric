import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import TermsConditionsScreen from "../screens/TermsConditionsScreen";
import SupportScreen from "../screens/SupportScreen";
import ActivitySummaryScreen from "../screens/ActivitySummaryScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createStackNavigator();

export default function ActivitySummaryStack() {
 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActivitySummaryScreen" component={ActivitySummaryScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />

      



    </Stack.Navigator>
  );
}
