// src/features/admin/categorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadCategories = () => {
  try {
    const serialized = localStorage.getItem("categories");
    if (serialized === null) return ["Villa", "Apartment", "Houseboat"];
    return JSON.parse(serialized);
  } catch {
    return ["Villa", "Apartment", "Houseboat"];
  }
};

const initialState = {
  categories: loadCategories(),
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      localStorage.setItem("categories", JSON.stringify(state.categories));
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
      localStorage.setItem("categories", JSON.stringify(state.categories));
    },
    updateCategory: (state, action) => {
      const { oldName, newName } = action.payload;
      const index = state.categories.indexOf(oldName);
      if (index !== -1) state.categories[index] = newName;
      localStorage.setItem("categories", JSON.stringify(state.categories));
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((c) => c !== action.payload);
      localStorage.setItem("categories", JSON.stringify(state.categories));
    },
  },
});

export const { setCategories, addCategory, updateCategory, deleteCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
