import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  recentlyViewedItems: localStorage.getItem('recentlyViewed')
    ? JSON.parse(localStorage.getItem('recentlyViewed'))
    : [],
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addRecentlyViewed: (state, action) => {
      const item = action.payload;
      
      // Filter out if it already exists to prevent duplicates
      const filteredItems = state.recentlyViewedItems.filter(
        (x) => x._id !== item._id
      );

      // Push to the top of the array
      filteredItems.unshift(item);

      // Cap at 6 items
      if (filteredItems.length > 6) {
        filteredItems.pop();
      }

      state.recentlyViewedItems = filteredItems;
      localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewedItems));
    },
  },
});

export const { addRecentlyViewed } = recentlyViewedSlice.actions;

export default recentlyViewedSlice.reducer;
