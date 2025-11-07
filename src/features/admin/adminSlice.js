import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: null,
  token: localStorage.getItem("adminToken") || null,
  categories: [], // ✅ categories ka state
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
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(
        (cat) => cat.id !== action.payload
      );
    },
    updateCategory: (state, action) => {
      const { id, name } = action.payload;
      const index = state.categories.findIndex((cat) => cat.id === id);
      if (index !== -1) {
        state.categories[index].name = name;
      }
    },
  },
});

export const {
  setAdmin,
  logoutAdmin,
  addCategory,
  setCategories,
  deleteCategory,
  updateCategory,
} = adminSlice.actions;
export default adminSlice.reducer;
