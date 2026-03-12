import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  items: [], // cart products
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const jobId = product.job_id ?? product.jobId ?? null;
      const existingItem = state.items.find(
        item => item.id === product.id && (item.job_id ?? item.jobId) === jobId,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
          job_id: jobId,
          jobId: jobId,
        });
      }
    },
    updateQuantity: (state, action) => {
      const {productId, newQuantity, jobId} = action.payload;
      const item = state.items.find(
        i => i.id === productId && (i.job_id ?? i.jobId) === jobId,
      );

      if (item) {
        if (newQuantity === 0) {
          state.items = state.items.filter(
            i => !(i.id === productId && (i.job_id ?? i.jobId) === jobId),
          );
        } else {
          item.quantity = newQuantity;
        }
      }
    },
    clearCart: state => {
      state.items = [];
    },
    clearCartForJob: (state, action) => {
      const jobId = action.payload;
      if (jobId != null) {
        state.items = state.items.filter(
          i => (i.job_id ?? i.jobId) !== jobId,
        );
      }
    },
  },
});

export const {addToCart, updateQuantity, clearCart, clearCartForJob} =
  cartSlice.actions;
export default cartSlice.reducer;
