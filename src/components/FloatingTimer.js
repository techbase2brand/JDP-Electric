// import React, { useRef } from "react";
// import { Text, StyleSheet, PanResponder, Animated } from "react-native";
// import { useSelector } from "react-redux";
// import { useNavigation } from "@react-navigation/native";

// export default function FloatingTimer() {
//   const { elapsedTime, isRunning } = useSelector((state) => state.timer);
//   const navigation = useNavigation();

//   const position = useRef(new Animated.ValueXY({ x: 300, y: 600 })).current;
//   const lastTap = useRef(0);

// //   const formatTime = (ms) => {
// //     const sec = Math.floor(ms / 1000);
// //     const m = Math.floor(sec / 60);
// //     const s = sec % 60;
// //     return `${m}:${s < 10 ? "0" : ""}${s}`;
// //   };
// const formatTime = (ms) => {
//   const sec = Math.floor(ms / 1000);
//   const h = Math.floor(sec / 3600);
//   const m = Math.floor((sec % 3600) / 60);
//   const s = sec % 60;

//   const hh = h.toString().padStart(2, "0");
//   const mm = m.toString().padStart(2, "0");
//   const ss = s.toString().padStart(2, "0");

//   return `${hh}:${mm}:${ss}`;
// };
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         position.setOffset({
//           x: position.x._value,
//           y: position.y._value,
//         });
//         position.setValue({ x: 0, y: 0 });
//       },
//       onPanResponderMove: Animated.event(
//         [null, { dx: position.x, dy: position.y }],
//         { useNativeDriver: false }
//       ),
//       onPanResponderRelease: (e, gesture) => {
//         position.flattenOffset();
//         // If drag distance is very small → treat as click
//         if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
//           const now = Date.now();
//           if (now - lastTap.current < 300) {
//             // Double tap → optional future feature
//           } else {
//             navigation.navigate("TimerScreen");
//           }
//           lastTap.current = now;
//         }
//       },
//     })
//   ).current;

//   if (!isRunning) return null;

//   return (
//     <Animated.View
//       style={[
//         styles.floating,
//         { transform: [{ translateX: position.x }, { translateY: position.y }] },
//       ]}
//       {...panResponder.panHandlers}
//     >
//       <Text style={styles.text}>{formatTime(elapsedTime)}</Text>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   floating: {
//     position: "absolute",
//     backgroundColor: "red",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 50,
//     elevation: 5,
//     zIndex: 9999,
//   },
//   text: { color: "white", fontWeight: "bold" },
// });
import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FloatingTimer() {
  const {elapsedTime, isRunning} = useSelector(state => state.timer);
  const navigation = useNavigation();
  const [jobId , setJobId] = useState();

  const position = useRef(new Animated.ValueXY({x: 300, y: 600})).current;
  const lastTap = useRef(0);

  const {width, height} = Dimensions.get('window');

  const TIMER_WIDTH = 120; // approx button width
  const TIMER_HEIGHT = 50; // approx button height
  const PADDING = 10; // small margin

  const formatTime = ms => {
    const sec = Math.floor(ms / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const getId = async () => {
      try {
        const activeJobId = await AsyncStorage.getItem('activeJobId');
        console.log('activeJobIdactiveJobId', activeJobId);
        setJobId(activeJobId);
      } catch (error) {
        console.log('Error reading activeJobId:', error);
      }
    };

    getId(); // call the async function
  }, []);
const jobIdRef = useRef(jobId);

// Update ref whenever state changes
useEffect(() => {
  jobIdRef.current = jobId;
  
}, [jobId]);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
        position.setValue({x: 0, y: 0});
      },
      onPanResponderMove: (e, gesture) => {
        // Boundary limit logic
        const newX = Math.min(
          Math.max(gesture.dx + position.x._offset, PADDING),
          width - TIMER_WIDTH - PADDING,
        );
        const newY = Math.min(
          Math.max(gesture.dy + position.y._offset, PADDING),
          height - TIMER_HEIGHT - PADDING,
        );
        position.setValue({
          x: newX - position.x._offset,
          y: newY - position.y._offset,
        });
      },
      onPanResponderRelease: (e, gesture) => {
        position.flattenOffset();

        // Tap detection (not drag)
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          const now = Date.now();
          if (now - lastTap.current < 300) {
            // double tap future feature
          } else {
            navigation.navigate('TimerScreen', {jobId});
          }
          lastTap.current = now;
        }
      },
    }),
  ).current;

  if (!isRunning) return null;

  return (
    <Animated.View
      style={[
        styles.floating,
        {
          transform: [{translateX: position.x}, {translateY: position.y}],
        },
      ]}
      {...panResponder.panHandlers}>
      <Text style={styles.text}>{formatTime(elapsedTime)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    backgroundColor: 'red',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
    elevation: 5,
    zIndex: 9999,
  },
  text: {color: 'white', fontWeight: 'bold'},
});
