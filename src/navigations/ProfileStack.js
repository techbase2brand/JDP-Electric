import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import TermsConditionsScreen from "../screens/TermsConditionsScreen";
import SupportScreen from "../screens/SupportScreen";

const Stack = createStackNavigator();

export default function ProfileStack() {
 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />



    </Stack.Navigator>
  );
}
