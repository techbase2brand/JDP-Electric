import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './userSlice'; // Create this slice below
import timerReducer from './timerSlice'; // Create this slice below
import cartReducer from './cartSlice';
import notificationReducer from './notificationSlice';
import liveTimerReducer from './liveTimerSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'timer', 'cart'], // only user will be persisted
};

const rootReducer = combineReducers({
  user: userReducer,
  timer: timerReducer,
  cart: cartReducer,
  notification: notificationReducer,
  liveTimers: liveTimerReducer, // server-driven timers (not persisted)
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
