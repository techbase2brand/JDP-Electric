import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TimeSheetScreen from "../screens/TimeSheetScreen";
import ViewTimesheet from "../screens/ViewTimeSheet";

const Stack = createStackNavigator();

export default function TimeSheetStack() {
 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TimeSheetScreen" component={TimeSheetScreen} />
      <Stack.Screen name="ViewTimesheet" component={ViewTimesheet} />
    </Stack.Navigator>
  );
}
