import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

const LOOK = {
  connected: {label: 'Live', color: '#16a34a'},
  connecting: {label: 'Connecting...', color: '#d97706'},
  reconnecting: {label: 'Reconnecting...', color: '#d97706'},
  disconnected: {label: 'Offline', color: '#9ca3af'},
};

/** Small "Live" / "Reconnecting..." pill for the real-time timer connection. */
const LiveIndicator = ({style}) => {
  const connection = useSelector(s => s.liveTimers.connection);
  const look = LOOK[connection] || LOOK.disconnected;
  return (
    <View style={[styles.pill, {backgroundColor: look.color + '1A'}, style]}>
      <View style={[styles.dot, {backgroundColor: look.color}]} />
      <Text style={[styles.text, {color: look.color}]}>{look.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start'},
  dot: {width: 7, height: 7, borderRadius: 4, marginRight: 5},
  text: {fontSize: 11, fontWeight: '700'},
});

export default LiveIndicator;
