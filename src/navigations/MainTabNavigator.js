import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Foundation from "react-native-vector-icons/Foundation";
import Feather from "react-native-vector-icons/Feather"; // ✅ Add this

import HomeStack from "./HomeStack";
import JobStack from "./JobStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

// All Icon Sets
const IconSets = {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Foundation,
  Feather
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, descriptors, navigation }) => {
        return (
          <View style={styles.tabContainer}>
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

              // 🔽 Icons config: Name & Type based on Focus
              const icons = {
                Home: {
                  focused: { name: 'home', type: 'Foundation' },
                  unfocused: { name: 'home', type: 'Feather' },
                },
                Jobs: {
                  focused: { name: 'briefcase', type: 'Ionicons' },
                  unfocused: { name: 'briefcase-outline', type: 'Ionicons' },
                },
                Profile: {
                  focused: { name: 'user', type: 'FontAwesome' },
                  unfocused: { name: 'user-o', type: 'FontAwesome' },
                },
              };

              const iconConfig = isFocused
                ? icons[route.name]?.focused
                : icons[route.name]?.unfocused;

              const IconComponent = IconSets[iconConfig?.type] || Ionicons;

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={styles.tabItem}
                  activeOpacity={0.7}
                >
                  <IconComponent
                    name={iconConfig?.name}
                    size={isFocused ? 24 : 22} // or adjust as per visual match
                    color="#fff"
                    style={{ marginBottom: 4 }}
                  />
                  <Text style={styles.label}>{route.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Jobs" component={JobStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#3A8DFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: width,
    position: 'absolute',
    bottom: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: '#fff',
    fontSize: 12,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 6,
  },
});
