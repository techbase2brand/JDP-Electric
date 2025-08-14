// import BackgroundService from 'react-native-background-actions';

// const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

// let startTime = 0;

// // Background task
// const backgroundTimerTask = async (taskDataArguments: { delay: number }) => {
//   const { delay } = taskDataArguments;
//   startTime = Date.now();

//   while (BackgroundService.isRunning()) {
//     const elapsedMs = Date.now() - startTime;

//     // Update your Redux timer here
//     // For example, dispatch action: setElapsedTime(elapsedMs)
//     console.log('Background Timer:', elapsedMs);

//     await sleep(delay);
//   }
// };

// // Options for the background service
// const options = {
//   taskName: 'TimerTask',
//   taskTitle: 'Timer Running',
//   taskDesc: 'Your timer is active',
//   taskIcon: { name: 'ic_launcher', type: 'mipmap' },
//   color: '#ff0000',
//   parameters: { delay: 1000 },
//   linkingURI: '', // optional deep linking
// };

// export const startBackgroundTimer = async () => {
//   console.log('Starting background timer...');
//   if (!BackgroundService.isRunning()) {
//     await BackgroundService.start(backgroundTimerTask, options);
//     console.log('Background timer started');
//   } else {
//     console.log('Background service already running');
//   }
// };

// export const stopBackgroundTimer = async () => {
//   if (BackgroundService.isRunning()) {
//     await BackgroundService.stop();
//   }
// };


import BackgroundService from 'react-native-background-actions';

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

// The background task running in an infinite loop
const backgroundTask = async ({ delay }) => {
  let i = 0;
  while (BackgroundService.isRunning()) {
    console.log('Background timer:', i++);
    await sleep(delay); // Wait for the specified delay
  }
};

const options = {
  taskName: 'TimerTask',  // Task name for background execution
  parameters: { delay: 1000 },  // Parameters passed to the task
  linkingURI: 'yourSchemeHere://chat/jane',  // Optional deep linking (e.g., when the task completes)
};

// Start the background timer task
 export const startBackgroundTimer = async () => {
  if (!BackgroundService.isRunning()) {
    await BackgroundService.start(backgroundTask, options);
  }
};

// Stop the background timer task
export const stopBackgroundTimer = async () => {
  if (BackgroundService.isRunning()) {
    await BackgroundService.stop();
  }
};
