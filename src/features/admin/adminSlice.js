// features/admin/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  token: localStorage.getItem("adminToken") || null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      localStorage.setItem("adminToken", action.payload.token);
    },
    logoutAdmin: (state) => {
      state.email = null;
      state.token = null;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { setAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
