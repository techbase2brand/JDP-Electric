// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   userData: null,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     setUser(state, action) {
//       state.userData = action.payload;
//     },
//     clearUser(state) {
//       state.userData = null;
//     },
//   },
// });

// export const { setUser, clearUser } = userSlice.actions;
// export default userSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
  permissions: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.permissions = action.payload.permissions;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.permissions = [];
    },
  },
});

export const {setUser, logout} = userSlice.actions;
export default userSlice.reducer;
