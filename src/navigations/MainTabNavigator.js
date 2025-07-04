import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

import HomeStack from './HomeStack';
import JobStack from './JobStack';
import ProfileStack from './ProfileStack';
import {
  HOME_ICON,
  HOME_ICON_FOCUSED,
  JOBS_ICON,
  JOBS_ICON_FOCUSED,
  PROFILE_ICON,
  PROFILE_ICON_FOCUSED,
  TIMESHEET_ICON,
  TIMESHEET_ICON_FOCUSED,
} from '../assests/images';
import TimeSheetStack from './TimeSheetStack';
import LinearGradient from 'react-native-linear-gradient';


const Tab = createBottomTabNavigator();
const {width} = Dimensions.get('window');

export default function MainTabNavigator() {
  const icons = {
    Home: {focused: HOME_ICON_FOCUSED, unfocused: HOME_ICON},
    TimeSheet: {focused: TIMESHEET_ICON_FOCUSED, unfocused: TIMESHEET_ICON},
    Jobs: {focused: JOBS_ICON_FOCUSED, unfocused: JOBS_ICON},
    Profile: {focused: PROFILE_ICON_FOCUSED, unfocused: PROFILE_ICON},
  };

  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={({state, navigation}) => (
        <LinearGradient  colors={['#3A79E8', '#009FE3']} // bottom to top gradient
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }} style={styles.tabContainer}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const iconSource = isFocused
              ? icons[route.name]?.focused
              : icons[route.name]?.unfocused;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}>
                <Image
                  source={iconSource}
                  style={[
                    styles.icon,
                    {tintColor: isFocused ? '#fff' : '#fff'},
                  ]}
                  resizeMode="contain"
                />
                <Text style={[styles.label,{fontWeight:isFocused?"700":"400"}]}>{route.name}</Text>
              </TouchableOpacity>
            );
          })}
        </LinearGradient>
      )}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="TimeSheet" component={TimeSheetStack} />
      <Tab.Screen name="Jobs" component={JobStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // paddingVertical: 14,
    borderTopLeftRadius:35,
    borderTopRightRadius:35,
    // backgroundColor: '#111C2D',
    width,
    position: 'absolute',
    bottom: 0,
    height: 110,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  label: {
    color: '#fff',
    fontSize: 12,
  },
});
