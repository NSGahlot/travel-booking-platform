// src/features/user/bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: JSON.parse(localStorage.getItem("bookings")) || [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
      localStorage.setItem("bookings", JSON.stringify(state.bookings));
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.bookings.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.bookings[index].status = status;
        localStorage.setItem("bookings", JSON.stringify(state.bookings));
      }
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
      localStorage.setItem("bookings", JSON.stringify(state.bookings));
    },
  },
});

export const { addBooking, updateBookingStatus, setBookings } =
  bookingSlice.actions;
export default bookingSlice.reducer;
