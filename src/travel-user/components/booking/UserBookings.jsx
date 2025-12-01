import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
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

        const userBookings = allBookings.filter((b) =>
          b.userEmail ? b.userEmail === user.email : true
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

  useEffect(() => {
    getUserBookings();
    const interval = setInterval(getUserBookings, 3000);
    return () => clearInterval(interval);
  }, [getUserBookings]);

  const statusClass = (status) =>
    status === "Approved"
      ? "status-approved"
      : status === "Rejected"
      ? "status-rejected"
      : "status-pending";

  return (
    <div className="user-bookings-container">
      <UserNav />
      <h2 className="user-bookings-title">My Bookings</h2>
      <table className="user-bookings-table">
        <thead className="user-bookings-thead">
          <tr>
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserBookings;
