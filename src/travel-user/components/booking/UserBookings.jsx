import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import "./UserBookings.css";
import UserNav from "../UserNav";

const DB_URL = "https://travel-app-2d78a-default-rtdb.firebaseio.com";

function UserBookings() {
  const user = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);

  const getUserBookings = useCallback(async () => {
    try {
      const res = await axios.get(`${DB_URL}/bookings.json`);
      if (res.data) {
        const allBookings = Object.entries(res.data).map(([id, value]) => ({
          id,
          ...value,
        }));

        const userBookings = allBookings.filter(
          (b) => b.userEmail === user.email,
        );

        setBookings(userBookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  }, [user.email]);

  const cancelBooking = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "Keep Booking",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#0ea5e9",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`${DB_URL}/bookings/${id}.json`, {
        status: "Cancelled",
      });

      toast.success("Booking cancelled successfully.");
      getUserBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error("Failed to cancel booking.");
    }
  };

  useEffect(() => {
    getUserBookings();
  }, [getUserBookings]);

  const statusClass = (status) =>
    status === "Approved"
      ? "status-approved"
      : status === "Rejected"
        ? "status-rejected"
        : status === "Cancelled"
          ? "status-cancelled"
          : "status-pending";

  return (
    <div className="user-bookings-container">
      <UserNav />
      <section className="ub-hero">
        <div className="ub-hero-content">
          <p className="ub-hero-badge">📌 Booking Center</p>
          <h2 className="user-bookings-title">My Bookings</h2>
          <p className="ub-hero-subtitle">
            Track approvals, dates, and your upcoming plans at a glance.
          </p>
        </div>
      </section>
      <table className="user-bookings-table">
        <thead className="user-bookings-thead">
          <tr>
            <th>Status</th>
            <th>Action</th>
            <th>Listing</th>
            <th>Price</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Guests</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-bookings-cell">
                No bookings yet.
              </td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id} className="user-bookings-row">
                <td>{b.listingName}</td>
                <td>₹{b.price}</td>
                <td>{b.checkIn}</td>
                <td>{b.checkOut}</td>
                <td>{b.guests}</td>
                <td className={statusClass(b.status)}>{b.status}</td>
                <td>
                  {b.status === "Pending" ? (
                    <button
                      className="cancel-booking-btn"
                      onClick={() => cancelBooking(b.id)}
                    >
                      Cancel
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserBookings;
