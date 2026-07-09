// src/store/timerSlice.js
import {createSlice} from '@reduxjs/toolkit';
import BackgroundTimer from 'react-native-background-timer';

let timerId = null;

const initialState = {
  isRunning: false,
  startTime: null,
  elapsedTime: 0,
};

const stopTicking = () => {
  if (timerId) {
    BackgroundTimer.clearInterval(timerId);
    timerId = null;
  }
};

const beginTicking = dispatch => {
  stopTicking();
  timerId = BackgroundTimer.setInterval(() => {
    dispatch(updateElapsedTime());
  }, 1000);
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: state => {
      state.startTime = Date.now();
      state.isRunning = true;
    },
    pauseTimer: state => {
      state.isRunning = false;
    },
    resumeTimer: state => {
      state.startTime = Date.now() - state.elapsedTime;
      state.isRunning = true;
    },
    stopTimer: state => {
      state.isRunning = false;
      state.startTime = null;
      state.elapsedTime = 0;
    },
    updateElapsedTime: state => {
      if (state.startTime != null) {
        state.elapsedTime = Date.now() - state.startTime;
      }
    },
  },
});

export const {startTimer, pauseTimer, resumeTimer, stopTimer, updateElapsedTime} =
  timerSlice.actions;

/** Restart the tick loop and catch up elapsed from startTime (iOS background / app relaunch). */
export const ensureTimerTicking = () => (dispatch, getState) => {
  const timer = getState()?.timer;
  if (!timer?.isRunning) {
    stopTicking();
    return;
  }

  if (timer.startTime == null) {
    dispatch(resumeTimer());
  } else {
    dispatch(updateElapsedTime());
  }

  beginTicking(dispatch);
};

export const startTimerWithBackground = () => dispatch => {
  dispatch(startTimer());
  beginTicking(dispatch);
};

export const pauseTimerWithBackground = () => dispatch => {
  dispatch(pauseTimer());
  stopTicking();
};

export const resumeTimerWithBackground = () => dispatch => {
  dispatch(resumeTimer());
  beginTicking(dispatch);
};

export const stopTimerWithBackground = () => dispatch => {
  dispatch(stopTimer());
  stopTicking();
};

export default timerSlice.reducer;
