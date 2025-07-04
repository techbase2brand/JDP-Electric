import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TimeSheetScreen from "../screens/TimeSheetScreen";

const Stack = createStackNavigator();

export default function TimeSheetStack() {
 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TimeSheetScreen" component={TimeSheetScreen} />
    </Stack.Navigator>
  );
}
