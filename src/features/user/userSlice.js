// features/user/userSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: localStorage.getItem("userEmail") || null,
  token: localStorage.getItem("userToken") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.token = action.payload.token;

      localStorage.setItem("userEmail", action.payload.email);
      localStorage.setItem("userToken", action.payload.token);
    },

    logoutUser: (state) => {
      state.email = null;
      state.token = null;

      localStorage.removeItem("userEmail");
      localStorage.removeItem("userToken");
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
