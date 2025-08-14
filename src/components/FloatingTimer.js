// import React from "react";
// import { TouchableOpacity, Text, StyleSheet } from "react-native";
// import { useSelector } from "react-redux";
// import { useNavigation } from "@react-navigation/native";

// export default function FloatingTimer() {
//   const { elapsedTime, isRunning } = useSelector((state) => state.timer);
//   const navigation = useNavigation();

//   if (!isRunning) return null;

//   const formatTime = (ms) => {
//     const sec = Math.floor(ms / 1000);
//     const m = Math.floor(sec / 60);
//     const s = sec % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };

//   return (
//     <TouchableOpacity
//       style={styles.floating}
//       onPress={() => navigation.navigate("TimerScreen")}
//     >
//       <Text style={{ color: "white" }}>{formatTime(elapsedTime)}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   floating: {
//     position: "absolute",
//     bottom: 30,
//     right: 20,
//     backgroundColor: "red",
//     padding: 10,
//     borderRadius: 50,
//     elevation: 5,
//   },
// });
import React, { useRef } from "react";
import { Text, StyleSheet, PanResponder, Animated } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function FloatingTimer() {
  const { elapsedTime, isRunning } = useSelector((state) => state.timer);
  const navigation = useNavigation();

  const position = useRef(new Animated.ValueXY({ x: 300, y: 600 })).current;
  const lastTap = useRef(0);

//   const formatTime = (ms) => {
//     const sec = Math.floor(ms / 1000);
//     const m = Math.floor(sec / 60);
//     const s = sec % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };
const formatTime = (ms) => {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  const hh = h.toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
        position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        position.flattenOffset();
        // If drag distance is very small → treat as click
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          const now = Date.now();
          if (now - lastTap.current < 300) {
            // Double tap → optional future feature
          } else {
            navigation.navigate("TimerScreen");
          }
          lastTap.current = now;
        }
      },
    })
  ).current;

  if (!isRunning) return null;

  return (
    <Animated.View
      style={[
        styles.floating,
        { transform: [{ translateX: position.x }, { translateY: position.y }] },
      ]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.text}>{formatTime(elapsedTime)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floating: {
    position: "absolute",
    backgroundColor: "red",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
    elevation: 5,
    zIndex: 9999,
  },
  text: { color: "white", fontWeight: "bold" },
});
