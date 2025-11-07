// src/travel-user/components/dashboard/UserDashboard.jsx

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNav from "../UserNav";
import "./UserDashboard.css";

const DB_URL =
  "https://travel-website-project-27e70-default-rtdb.firebaseio.com";

function UserDashboard() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);

  // ✅ Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${DB_URL}/bookings.json`);
        if (res.data) {
          const allBookings = Object.values(res.data);

          // ✅ Filter user bookings only (optional)
          const userBookings = user.email
            ? allBookings.filter((b) => b.userEmail === user.email)
            : allBookings;

          setBookings(userBookings);

          // ✅ Count approved bookings
          const approved = userBookings.filter(
            (b) => b.status === "Approved"
          ).length;
          setApprovedCount(approved);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [user.email]);

  // ✅ Stats to display
  const quickStats = [
    { id: 1, label: "Total Bookings", value: bookings.length },
    { id: 2, label: "Approved Bookings", value: approvedCount },
  ];

  return (
    <>
      <UserNav />
      <div className="udb-container">
        <h1 className="udb-title">👋 Welcome, {user.email || "Traveler"}</h1>
        <p className="udb-subtitle">
          Ready to explore new destinations? Here’s your quick overview.
        </p>

        {/* ✅ Stats Grid */}
        <div className="udb-stats-grid">
          {quickStats.map((stat) => (
            <div key={stat.id} className="udb-stat-card">
              <h2
                className={`udb-stat-value ${
                  stat.label === "Approved Bookings" ? "approved" : "default"
                }`}
              >
                {stat.value}
              </h2>
              <p className="udb-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ✅ Navigation Buttons */}
        <div className="udb-actions">
          <button
            onClick={() => navigate("/user/listings")}
            className="btn btn-primary"
          >
            🔍 Explore Listings
          </button>
          <button
            onClick={() => navigate("/user/bookings")}
            className="btn btn-success"
          >
            📘 View Bookings
          </button>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
