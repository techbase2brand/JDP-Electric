import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { tabColor } from '../constants/Color';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = '#fff'; // text color
const ACTIVE_BG = '#fff';
const INACTIVE_BG = 'transparent';

export default function CustomTabBar({state, descriptors, navigation, icons}) {
  const homeIndex = state.routes.findIndex(r => r.name === 'Home');
  const jobIndex = state.routes.findIndex(r => r.name === 'Jobs');
  const ProfileIndex = state.routes.findIndex(r => r.name === 'Profile'); // <- yaha Jobs tab ka name use karo
   // <- yaha Jobs tab ka name use karo

  // Home tab ke liye hide list
  const homeHideOnScreens = [
    'JobStack',
    'CreateJobScreen',
    'ReportsScreen',
    'NotificationScreen',
    'SupportScreen',
    'JobDetail',
    'MapScreen',
    'BluesheetSubmission',
    'OrderProducts',
    'OrderConfirmationScreen',
    'OrderHistoryScreen',
    'CartScreen',
    'TimerScreen',
    'InvoiceScreen',
    'CheckoutScreen',
    'WarrantyChecker',
    'ProfileScreen',
    'EditProfile',
    'TermsConditions',
    'PrivacyPolicy',
  ];

  // Job tab ke liye hide list
  const jobHideOnScreens = [
    'JobDetailsScreen',
    'JobDetail',
    'MapScreen',
    'TimerScreen',
    'BluesheetSubmission',
    'OrderProducts',
    'OrderConfirmationScreen',
    'OrderHistoryScreen',
    'CartScreen',
    'CheckoutScreen',
    'CreateJobScreen',
  ];

   const profileHideOnScreens = [
    'EditProfile',
    'TermsConditions',
    'SupportScreen',
    'PrivacyPolicy',
  ];

  // --- Check for Home tab ---
  if (state.index === homeIndex) {
    const homeState = state.routes[homeIndex]?.state;
    const nestedRouteName = homeState?.routes?.[homeState.index]?.name;

    if (nestedRouteName && homeHideOnScreens.includes(nestedRouteName)) {
      return null;
    }
  }

  // --- Check for Job tab ---
  if (state.index === jobIndex) {
    const jobState = state.routes[jobIndex]?.state;
    const nestedRouteName = jobState?.routes?.[jobState.index]?.name;

    if (nestedRouteName && jobHideOnScreens.includes(nestedRouteName)) {
      return null;
    }
  }

  // --- Check for Profile tab ---
  if (state.index === ProfileIndex) {
    const jobState = state.routes[ProfileIndex]?.state;
    const nestedRouteName = jobState?.routes?.[jobState.index]?.name;

    if (nestedRouteName && profileHideOnScreens.includes(nestedRouteName)) {
      return null;
    }
  }
  return (
    // <View style={styles.container}>
        <LinearGradient
    colors={['#155DFC', '#1447E6', '#432DD7']}
    style={styles.container}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  >
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

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

        const iconSource = icons?.[route.name]
          ? isFocused
            ? icons[route.name].focused
            : icons[route.name].unfocused
          : null;

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              {
                backgroundColor: isFocused ? ACTIVE_BG : INACTIVE_BG,
              },
            ]}>
            <Image
              source={iconSource}
              style={[styles.icon]}
              resizeMode="contain"
            />
            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(150)}
                exiting={FadeOut.duration(100)}
                style={styles.text}>
                {label}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    {/* </View> */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tabColor,
    width: '80%',
    height: '8%',

    alignSelf: 'center',
    bottom: 40,
    borderRadius: 40,
    // paddingHorizontal: 12,
    // paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 30,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    color: tabColor,
    marginLeft: 8,
    fontWeight: '500',
  },
});
