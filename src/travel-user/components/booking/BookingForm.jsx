// src/travel-user/components/bookings/BookingForm.jsx
import { useState } from "react";
import axios from "axios";
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
      alert("Please select both Check-In and Check-Out dates.");
      return;
    }

    try {
      const newBooking = {
        listingName: listing.name,
        listingId: listing.id,
        price: listing.price,
        address: listing.address,
        userEmail: user.email,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        status: "Pending",
      };

      await axios.post(`${DB_URL}/bookings.json`, newBooking);
      alert("Booking request sent successfully!");
      setFormData({ checkIn: "", checkOut: "", guests: 1 });
    } catch (error) {
      console.error("Error booking:", error);
    }
  };

  return (
    <div className="booking-form">
      <input
        type="date"
        value={formData.checkIn}
        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
        className="booking-input"
      />
      <input
        type="date"
        value={formData.checkOut}
        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
        className="booking-input"
      />
      <input
        type="number"
        min="1"
        value={formData.guests}
        onChange={(e) =>
          setFormData({ ...formData, guests: Number(e.target.value) })
        }
        className="booking-input guests-input"
      />
      <button onClick={handleBookNow} className="booking-btn">
        Book Now
      </button>
    </div>
  );
}

export default BookingForm;
