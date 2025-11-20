import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import JobStack from './JobStack';
import ProfileStack from './ProfileStack';
import TimeSheetStack from './TimeSheetStack';
import CustomTabBar from '../components/CustomTabBar';
import {
  HOME_ICON,
  HOME_ICON_FOCUSED,
  JOBS_ICON,
  JOBS_ICON_FOCUSED,
  PROFILE_ICON,
  PROFILE_ICON_FOCUSED,
  REPORTS_ICON,
  REPORTS_ICON_FOCUSED,
  TIMESHEET_ICON,
  TIMESHEET_ICON_FOCUSED,
} from '../assests/images';
import ActivitySummaryStack from './ActivitySummaryStack';
import {useSelector} from 'react-redux';
import useHasPermission from '../hooks/useHasPermission';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const user = useSelector(state => state.user.user);
  const canViewBlueSheet = useHasPermission('bluesheet', 'view');

  const icons = {
    Home: {focused: HOME_ICON_FOCUSED, unfocused: HOME_ICON},
    BlueSheet: {focused: TIMESHEET_ICON_FOCUSED, unfocused: TIMESHEET_ICON},
    Jobs: {focused: JOBS_ICON_FOCUSED, unfocused: JOBS_ICON},
    Activity: {focused: REPORTS_ICON_FOCUSED, unfocused: REPORTS_ICON},
    Profile: {focused: PROFILE_ICON_FOCUSED, unfocused: PROFILE_ICON},
  };

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} icons={icons} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      
      >
      <Tab.Screen name="Home" component={HomeStack} />
      {canViewBlueSheet && (
        <Tab.Screen name="BlueSheet" component={TimeSheetStack} />
      )}
      <Tab.Screen name="Jobs" component={JobStack} />
      {/* {canViewBlueSheet && ( */}
      <Tab.Screen name="Activity" component={ActivitySummaryStack} />
      {/* )} */}
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
