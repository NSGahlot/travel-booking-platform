import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../AdminNav";

const DB_URL =
  "https://travel-website-project-27e70-default-rtdb.firebaseio.com";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await axios.get(`${DB_URL}/bookings.json`);
    if (res.data) {
      const loaded = Object.entries(res.data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setBookings(loaded);
    } else setBookings([]);
  };

  const handleApprove = async (id) => {
    await axios.patch(`${DB_URL}/bookings/${id}.json`, { status: "approved" });
    await fetchBookings();
  };

  const handleReject = async (id) => {
    await axios.patch(`${DB_URL}/bookings/${id}.json`, { status: "rejected" });
    fetchBookings();
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ width: "700px", margin: "50px auto" }}>
      <AdminNav />
      <h2>Booking Management</h2>
      <table border="1" width="100%" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Listing</th>
            <th>User</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Guests</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.listingName}</td>
              <td>
                {b.userName} ({b.userEmail})
              </td>
              <td>{b.checkIn}</td>
              <td>{b.checkOut}</td>
              <td>{b.guests}</td>
              <td>₹{b.totalPrice}</td>
              <td>{b.status}</td>
              <td>
                {b.status === "pending" && (
                  <>
                    <button onClick={() => handleApprove(b.id)}>Approve</button>
                    <button onClick={() => handleReject(b.id)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookings;
