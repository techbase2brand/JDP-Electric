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
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({...product, quantity: 1});
      }
    },
    updateQuantity: (state, action) => {
      const {productId, newQuantity} = action.payload;
      const item = state.items.find(item => item.id === productId);

      if (item) {
        if (newQuantity === 0) {
          state.items = state.items.filter(i => i.id !== productId);
        } else {
          item.quantity = newQuantity;
        }
      }
    },
    clearCart: state => {
      state.items = [];
    },
  },
});

export const {addToCart, updateQuantity, clearCart} = cartSlice.actions;
export default cartSlice.reducer;
