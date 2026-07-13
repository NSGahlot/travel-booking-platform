import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("wishlist")) || [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    toggleWishlist: (state, action) => {
      const listing = action.payload;

      const exists = state.items.find((item) => item.id === listing.id);

      if (exists) {
        state.items = state.items.filter((item) => item.id !== listing.id);
      } else {
        state.items.push(listing);
      }

      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },

    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem("wishlist");
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
