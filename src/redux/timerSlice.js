// src/store/timerSlice.js
import { createSlice } from "@reduxjs/toolkit";
import BackgroundTimer from "react-native-background-timer";

let timerId = null;

const initialState = {
  isRunning: false,
  startTime: null,
  elapsedTime: 0,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state) => {
      state.startTime = Date.now();
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    resumeTimer: (state) => {
      state.startTime = Date.now() - state.elapsedTime;
      state.isRunning = true;
    },
    stopTimer: (state) => {
      state.isRunning = false;
      state.startTime = null;
      state.elapsedTime = 0;
    },
    updateElapsedTime: (state) => {
      state.elapsedTime = Date.now() - state.startTime;
    },
  },
});

export const { startTimer, pauseTimer, resumeTimer, stopTimer, updateElapsedTime } =
  timerSlice.actions;

export const startTimerWithBackground = () => (dispatch) => {
  dispatch(startTimer());
  if (timerId) BackgroundTimer.clearInterval(timerId);
  timerId = BackgroundTimer.setInterval(() => {
    dispatch(updateElapsedTime());
  }, 1000);
};

export const pauseTimerWithBackground = () => (dispatch) => {
  dispatch(pauseTimer());
  if (timerId) BackgroundTimer.clearInterval(timerId);
};

export const resumeTimerWithBackground = () => (dispatch) => {
  dispatch(resumeTimer());
  if (timerId) BackgroundTimer.clearInterval(timerId);
  timerId = BackgroundTimer.setInterval(() => {
    dispatch(updateElapsedTime());
  }, 1000);
};

export const stopTimerWithBackground = () => (dispatch) => {
  dispatch(stopTimer());
  if (timerId) BackgroundTimer.clearInterval(timerId);
};

export default timerSlice.reducer;
