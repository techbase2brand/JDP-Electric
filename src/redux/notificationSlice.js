import {createSlice} from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    unreadCount: 0,
  },
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = Math.max(0, Number(action.payload) || 0);
    },
  },
});

export const {setUnreadCount} = notificationSlice.actions;
export default notificationSlice.reducer;
