import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/admin/adminSlice";
import userReducer from "../features/user/userSlice";
import bookingReducer from "../features/user/bookingSlice";
import listingReducer from "../features/admin/listingSlice";
import searchReducer from "../features/user/searchSlice";
import categoryReducer from "../features/admin/categorySlice";
import cartReducer from "../features/user/cartSlice";

export const store = configureStore({
  reducer: {
    listings: listingReducer,
    admin: adminReducer,
    user: userReducer,
    booking: bookingReducer,
    search: searchReducer,
    categories: categoryReducer,
    cart: cartReducer,
  },
});
