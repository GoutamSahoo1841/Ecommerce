import { createSlice } from '@reduxjs/toolkit';

const getWishlistKey = () => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  return userInfo ? `wishlist_${userInfo._id}` : 'wishlist_guest';
};

const initialState = {
  wishlistItems: localStorage.getItem(getWishlistKey())
    ? JSON.parse(localStorage.getItem(getWishlistKey()))
    : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const existItem = state.wishlistItems.find((x) => x._id === item._id);

      if (!existItem) {
        state.wishlistItems.push(item);
        localStorage.setItem(getWishlistKey(), JSON.stringify(state.wishlistItems));
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (x) => x._id !== action.payload
      );
      localStorage.setItem(getWishlistKey(), JSON.stringify(state.wishlistItems));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('auth/setCredentials', (state, action) => {
        const user = action.payload;
        const wishlistKey = user ? `wishlist_${user._id}` : 'wishlist_guest';
        const stored = localStorage.getItem(wishlistKey);
        state.wishlistItems = stored ? JSON.parse(stored) : [];
      })
      .addCase('auth/logout', (state) => {
        state.wishlistItems = [];
      });
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
