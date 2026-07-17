// src/travel-user/components/bookings/BookingForm.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import "./BookingForm.css";

const DB_URL = "https://travel-app-2d78a-default-rtdb.firebaseio.com";

function BookingForm({ listing }) {
  const user = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleBookNow = async () => {
    if (!formData.checkIn || !formData.checkOut) {
      toast.error("Please select both Check-In and Check-Out dates.");
      return;
    }

    if (formData.checkOut <= formData.checkIn) {
      toast.error("Check-Out date must be after Check-In date.");
      return;
    }

    try {
      const newBooking = {
        listingName: listing.name,
        listingId: listing.id,
        price: listing.price,
        address: listing.address,

        userName: user.name || "Guest",
        userEmail: user.email || "",

        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,

        bookingDate: new Date().toISOString(),

        status: "Pending",
      };

      await axios.post(`${DB_URL}/bookings.json`, newBooking);
      toast.success(
        "Booking request sent successfully! Waiting for admin approval.",
      );
      setFormData({ checkIn: "", checkOut: "", guests: 1 });
    } catch (error) {
      console.error("Error booking:", error);
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <div className="booking-form">
      <label className="sr-only" htmlFor="booking-check-in">
        Check-in date
      </label>
      <input
        id="booking-check-in"
        name="checkIn"
        type="date"
        value={formData.checkIn}
        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
        className="booking-input"
      />
      <label className="sr-only" htmlFor="booking-check-out">
        Check-out date
      </label>
      <input
        id="booking-check-out"
        name="checkOut"
        type="date"
        min={formData.checkIn}
        value={formData.checkOut}
        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
        className="booking-input"
      />
      <label className="sr-only" htmlFor="booking-guests">
        Guests
      </label>
      <input
        id="booking-guests"
        name="guests"
        type="number"
        min="1"
        value={formData.guests}
        onChange={(e) =>
          setFormData({ ...formData, guests: Number(e.target.value) })
        }
        className="booking-input guests-input"
      />
      <button type="button" onClick={handleBookNow} className="booking-btn">
        Book Now
      </button>
    </div>
  );
}

export default BookingForm;
