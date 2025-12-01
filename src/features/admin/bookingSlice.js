// src/features/admin/bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
};

const bookingSlice = createSlice({
  name: "adminBooking",
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.bookings.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.bookings[index].status = status;
      }
    },
  },
});

export const { setBookings, updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
