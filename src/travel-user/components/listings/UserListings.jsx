// src/travel-user/components/UserListings.jsx
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserNav from "../UserNav";
import "./UserListings.css";

const DB_URL =
  "https://travel-website-project-27e70-default-rtdb.firebaseio.com";
const FIXED_IMAGE_URL =
  "https://static2.tripoto.com/media/filter/nl/img/2025875/TripDocument/1601531054_these_traveling_tips_helps_me_having_hassle_free_journey.jpg";

function UserListings() {
  const navigate = useNavigate();
  const adminCategories = useSelector(
    (state) => state.categories.categories || []
  );

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    address: "",
  });

  const categories = ["All", ...adminCategories];

  const fetchListings = useCallback(async () => {
    try {
      const res = await axios.get(`${DB_URL}/listings.json`);
      if (res.data) {
        const loaded = Object.entries(res.data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setListings(loaded);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  }, []);

  useEffect(() => {
    fetchListings();
    const interval = setInterval(fetchListings, 5000);
    return () => clearInterval(interval);
  }, [fetchListings]);

  useEffect(() => {
    let filtered = listings.filter(
      (l) =>
        l.available === true ||
        l.available === "true" ||
        l.available === undefined
    );

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (l) =>
          l.category &&
          l.category.trim().toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    filtered = filtered.filter((l) => Number(l.price) <= maxPrice);

    setFilteredListings(filtered);
  }, [listings, selectedCategory, maxPrice]);

  const openModal = (listing) => {
    setCurrentListing(listing);
    setBookingDetails({
      name: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      address: "",
    });
    setModalOpen(true);
  };

  const handleBooking = async () => {
    const { name, checkIn, checkOut, guests, address } = bookingDetails;

    if (!name || !checkIn || !checkOut || !address) {
      alert("Please fill in all booking details including your name.");
      return;
    }

    const newBooking = {
      userName: name,
      listingName: currentListing.name,
      listingId: currentListing.id,
      price: currentListing.price,
      address,
      checkIn,
      checkOut,
      guests,
      status: "Pending",
    };

    try {
      await axios.post(`${DB_URL}/bookings.json`, newBooking);
      alert("Booking request sent successfully! Waiting for admin approval.");
      setModalOpen(false);
      setBookingDetails({
        name: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        address: "",
      });
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    navigate("/user/listings");
  };

  return (
    <>
      <UserNav />
      <div className="user-listings-container">
        <h2 className="listings-title">🏖 Available Listings</h2>

        <div className="category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`category-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="listings-grid">
          {filteredListings.length === 0 ? (
            <p className="no-listings">No listings found.</p>
          ) : (
            filteredListings.map((l) => (
              <div key={l.id} className="listing-card">
                <h3 className="listing-name">{l.name}</h3>
                <p>
                  <strong>Category:</strong> {l.category}
                </p>
                <p>
                  <strong>Price:</strong> ₹{l.price}
                </p>
                <p>
                  <strong>Address:</strong> {l.address}
                </p>
                <p>{l.description}</p>
                <img
                  src={
                    l.image && l.image.trim() !== "" ? l.image : FIXED_IMAGE_URL
                  }
                  alt={l.name || "Listing Image"}
                  className="listing-image"
                />
                <button onClick={() => openModal(l)} className="book-now-btn">
                  Book Now
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {modalOpen && currentListing && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <h2>Book {currentListing.name}</h2>

            <input
              type="text"
              placeholder="Enter your name"
              value={bookingDetails.name}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, name: e.target.value })
              }
              className="booking-input"
            />

            <label>
              Check-in:
              <input
                type="date"
                value={bookingDetails.checkIn}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    checkIn: e.target.value,
                  })
                }
                className="booking-input"
              />
            </label>

            <label>
              Check-out:
              <input
                type="date"
                value={bookingDetails.checkOut}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    checkOut: e.target.value,
                  })
                }
                className="booking-input"
              />
            </label>

            <label>
              Guests:
              <input
                type="number"
                min="1"
                value={bookingDetails.guests}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    guests: Number(e.target.value),
                  })
                }
                className="booking-input"
              />
            </label>

            <label>
              Address:
              <input
                type="text"
                value={bookingDetails.address}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    address: e.target.value,
                  })
                }
                className="booking-input"
              />
            </label>

            <div className="booking-buttons">
              <button
                onClick={() => setModalOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleBooking} className="confirm-btn">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserListings;
