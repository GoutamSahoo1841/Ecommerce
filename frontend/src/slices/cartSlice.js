import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const getInitialCartState = () => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  const cartKey = userInfo ? `cart_${userInfo._id}` : 'cart_guest';
  const stored = localStorage.getItem(cartKey);
  return stored
    ? JSON.parse(stored)
    : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal', couponCode: '', discountPercentage: 0 };
};

const initialState = getInitialCartState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      // Check if item is already in the cart
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // If exists, replace with new item (which has the updated qty)
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // If not exists, add new item to cartItems array
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
    applyCoupon: (state, action) => {
      state.couponCode = action.payload.code;
      state.discountPercentage = action.payload.discountPercentage;
      return updateCart(state);
    },
    removeCoupon: (state) => {
      state.couponCode = '';
      state.discountPercentage = 0;
      return updateCart(state);
    },
    enableBuyNow: (state, action) => {
      state.isBuyNow = true;
      state.buyNowItem = action.payload;
      return updateCart(state);
    },
    disableBuyNow: (state) => {
      state.isBuyNow = false;
      state.buyNowItem = null;
      return updateCart(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('auth/setCredentials', (state, action) => {
        const user = action.payload;
        const cartKey = user ? `cart_${user._id}` : 'cart_guest';
        const stored = localStorage.getItem(cartKey);
        const userCart = stored
          ? JSON.parse(stored)
          : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal', couponCode: '', discountPercentage: 0 };
        
        state.cartItems = userCart.cartItems || [];
        state.shippingAddress = userCart.shippingAddress || {};
        state.paymentMethod = userCart.paymentMethod || 'PayPal';
        state.couponCode = userCart.couponCode || '';
        state.discountPercentage = userCart.discountPercentage || 0;
        state.isBuyNow = false;
        state.buyNowItem = null;
      })
      .addCase('auth/logout', (state) => {
        state.cartItems = [];
        state.shippingAddress = {};
        state.paymentMethod = 'PayPal';
        state.couponCode = '';
        state.discountPercentage = 0;
        state.isBuyNow = false;
        state.buyNowItem = null;
      });
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  saveShippingAddress, 
  savePaymentMethod, 
  clearCartItems, 
  applyCoupon, 
  removeCoupon,
  enableBuyNow,
  disableBuyNow
} = cartSlice.actions;

export default cartSlice.reducer;
