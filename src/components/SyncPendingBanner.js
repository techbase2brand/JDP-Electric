import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

/** Shown while timer actions are saved on the phone but not sent to the server yet. */
const SyncPendingBanner = ({style}) => {
  const n = useSelector(s => s.liveTimers.pendingActions);
  if (!n) return null;
  return (
    <View style={[styles.box, style]}>
      <Text style={styles.title}>Not synced yet</Text>
      <Text style={styles.text}>
        {n} timer action{n > 1 ? 's' : ''} saved on this phone. They will be sent when you are online.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {backgroundColor: '#FEF3C7', borderRadius: 10, padding: 10, marginBottom: 10},
  title: {color: '#B45309', fontWeight: '700', fontSize: 13, textAlign: 'center'},
  text: {color: '#B45309', fontSize: 12, textAlign: 'center', marginTop: 2},
});

export default SyncPendingBanner;
