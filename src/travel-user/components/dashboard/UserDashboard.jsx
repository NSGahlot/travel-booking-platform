// src/travel-user/components/dashboard/UserDashboard.jsx

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNav from "../UserNav";
import "./UserDashboard.css";

const DB_URL = "https://travel-app-2d78a-default-rtdb.firebaseio.com";

function UserDashboard() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [listings, setListings] = useState([]);
  const [searchForm, setSearchForm] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${DB_URL}/bookings.json`);
        if (res.data) {
          const allBookings = Object.values(res.data);

          const userBookings = user.email
            ? allBookings.filter((b) => b.userEmail === user.email)
            : allBookings;

          setBookings(userBookings);

          const approved = userBookings.filter(
            (b) => b.status === "Approved"
          ).length;
          setApprovedCount(approved);
        } else {
          setBookings([]);
          setApprovedCount(0);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    const fetchListings = async () => {
      try {
        const res = await axios.get(`${DB_URL}/listings.json`);
        if (res.data) {
          const loaded = Object.entries(res.data).map(([id, value]) => ({
            id,
            ...value,
          }));
          setListings(loaded);
        } else {
          setListings([]);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchBookings();
    fetchListings();
  }, [user.email]);

  const featuredListings = useMemo(
    () => listings.filter((l) => l.available !== false).slice(0, 4),
    [listings]
  );

  const recommendedListings = useMemo(() => {
    const available = listings.filter((l) => l.available !== false);
    return available.slice(4, 8).length > 0 ? available.slice(4, 8) : available;
  }, [listings]);

  const recentBookings = useMemo(() => {
    const sorted = [...bookings].sort((a, b) => {
      const aDate = new Date(a.checkIn || 0).getTime();
      const bDate = new Date(b.checkIn || 0).getTime();
      return bDate - aDate;
    });
    return sorted.slice(0, 3);
  }, [bookings]);

  const quickStats = [
    { id: 1, label: "📦 Total Bookings", value: bookings.length },
    { id: 2, label: "✅ Approved Bookings", value: approvedCount },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/user/listings");
  };

  return (
    <>
      <UserNav />
      <div className="udb-container">
        <section className="udb-hero">
          <div className="udb-hero-content">
            <p className="udb-hero-badge">✨ Your Travel Hub</p>
            <h1 className="udb-title">👋 Welcome, {user.email || "Traveler"}</h1>
            <p className="udb-subtitle">
              Ready to explore new destinations? Discover curated stays and
              track your bookings in one place.
            </p>
            <div className="udb-hero-actions">
              <button
                onClick={() => navigate("/user/listings")}
                className="btn btn-primary"
              >
                🔍 Explore Listings
              </button>
              <button
                onClick={() => navigate("/user/bookings")}
                className="btn btn-ghost"
              >
                📘 View Bookings
              </button>
            </div>
          </div>
          <div className="udb-hero-card">
            <div className="udb-hero-stat">
              <span className="udb-hero-stat-label">Total Bookings</span>
              <strong>{bookings.length}</strong>
            </div>
            <div className="udb-hero-stat">
              <span className="udb-hero-stat-label">Approved</span>
              <strong>{approvedCount}</strong>
            </div>
            <div className="udb-hero-tip">
              Tip: Book early to unlock better deals.
            </div>
          </div>
        </section>

        <section className="udb-search">
          <div className="udb-section-title">Find your next stay</div>
          <form className="udb-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Destination"
              value={searchForm.destination}
              onChange={(e) =>
                setSearchForm({ ...searchForm, destination: e.target.value })
              }
            />
            <input
              type="date"
              value={searchForm.checkIn}
              onChange={(e) =>
                setSearchForm({ ...searchForm, checkIn: e.target.value })
              }
            />
            <input
              type="date"
              value={searchForm.checkOut}
              onChange={(e) =>
                setSearchForm({ ...searchForm, checkOut: e.target.value })
              }
            />
            <input
              type="number"
              min="1"
              value={searchForm.guests}
              onChange={(e) =>
                setSearchForm({
                  ...searchForm,
                  guests: Number(e.target.value),
                })
              }
              placeholder="Guests"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </section>

        <div className="udb-section-title">Your Overview</div>
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

        <section className="udb-grid">
          <div className="udb-block">
            <div className="udb-section-title">Popular destinations</div>
            <div className="udb-card-grid">
              {featuredListings.length === 0 ? (
                <p className="udb-empty">No featured listings yet.</p>
              ) : (
                featuredListings.map((l) => (
                  <div key={l.id} className="udb-mini-card">
                    <div className="udb-mini-title">{l.name}</div>
                    <div className="udb-mini-meta">
                      {l.category || "Stay"} • ₹{l.price}
                    </div>
                    <button
                      type="button"
                      className="udb-mini-btn"
                      onClick={() => navigate("/user/listings")}
                    >
                      View
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="udb-block">
            <div className="udb-section-title">Recent bookings</div>
            <div className="udb-list">
              {recentBookings.length === 0 ? (
                <p className="udb-empty">No recent bookings.</p>
              ) : (
                recentBookings.map((b, idx) => (
                  <div key={`${b.listingName}-${idx}`} className="udb-list-row">
                    <div>
                      <div className="udb-mini-title">{b.listingName}</div>
                      <div className="udb-mini-meta">
                        {b.checkIn || "-"} → {b.checkOut || "-"}
                      </div>
                    </div>
                    <span
                      className={`udb-status ${
                        b.status === "Approved"
                          ? "approved"
                          : b.status === "Rejected"
                          ? "rejected"
                          : "pending"
                      }`}
                    >
                      {b.status || "Pending"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="udb-block">
          <div className="udb-section-title">Recommended for you</div>
          <div className="udb-card-grid">
            {recommendedListings.length === 0 ? (
              <p className="udb-empty">No recommendations yet.</p>
            ) : (
              recommendedListings.map((l) => (
                <div key={l.id} className="udb-mini-card alt">
                  <div className="udb-mini-title">{l.name}</div>
                  <div className="udb-mini-meta">
                    {l.category || "Stay"} • ₹{l.price}
                  </div>
                  <button
                    type="button"
                    className="udb-mini-btn"
                    onClick={() => navigate("/user/listings")}
                  >
                    Explore
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </>
  );
}

export default UserDashboard;
