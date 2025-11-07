import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./AdminBookings.css";

const DB_URL =
  "https://travel-website-project-27e70-default-rtdb.firebaseio.com";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  // ✅ Wrap fetchBookings inside useCallback to prevent re-creation on every render
  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get(`${DB_URL}/bookings.json`);
      if (res.data) {
        const allBookings = Object.entries(res.data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setBookings(allBookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  }, []); // No dependencies → stable reference

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${DB_URL}/bookings/${id}.json`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // ✅ Now safely include fetchBookings in dependencies
  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 3000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  const calculateDays = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "-";
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  return (
    <div className="admin-bookings-container">
      <h2 className="admin-bookings-title">All Bookings</h2>
      <table className="admin-bookings-table">
        <thead className="admin-bookings-thead">
          <tr>
            <th>User Name</th>
            <th>Listing</th>
            <th>Price</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Guests</th>
            <th>Duration (days)</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="9" className="no-bookings-cell">
                No bookings yet.
              </td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id} className="admin-bookings-row">
                <td>{b.userName || "Guest"}</td>
                <td>{b.listingName}</td>
                <td>₹{b.price}</td>
                <td>{b.checkIn}</td>
                <td>{b.checkOut}</td>
                <td>{b.guests}</td>
                <td>{calculateDays(b.checkIn, b.checkOut)}</td>
                <td
                  className={
                    b.status === "Approved"
                      ? "status-approved"
                      : b.status === "Rejected"
                      ? "status-rejected"
                      : "status-pending"
                  }
                >
                  {b.status}
                </td>
                <td>
                  {b.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => updateStatus(b.id, "Approved")}
                        className="btn btn-approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, "Rejected")}
                        className="btn btn-reject"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="no-action">—</span>
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

export default AdminBookings;
