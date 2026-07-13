// src/travel-user/components/UserListings.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserNav from "../UserNav";
import "./UserListings.css";

const DB_URL = "https://travel-app-2d78a-default-rtdb.firebaseio.com";
const FIXED_IMAGE_URL =
  "https://static2.tripoto.com/media/filter/nl/img/2025875/TripDocument/1601531054_these_traveling_tips_helps_me_having_hassle_free_journey.jpg";

function UserListings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const destination = searchParams.get("destination") || "";
  // const guests = Number(searchParams.get("guests")) || 1;
  const userToken = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user);
  const adminCategories = useSelector(
    (state) => state.categories.categories || [],
  );

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    address: "",
  });

  const categories = ["All", ...adminCategories];
  const authQuery = userToken ? `?auth=${userToken}` : "";

  const fetchListings = useCallback(async () => {
    try {
      const res = await axios.get(`${DB_URL}/listings.json${authQuery}`);
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
  }, [authQuery]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const maxListingPrice = useMemo(() => {
    if (listings.length === 0) return 10000;
    return Math.max(10000, ...listings.map((l) => Number(l.price || 0)));
  }, [listings]);

  useEffect(() => {
    setMaxPrice((prev) => Math.min(prev, maxListingPrice));
  }, [maxListingPrice]);

  useEffect(() => {
    let filtered = listings.filter(
      (l) =>
        l.available === true ||
        l.available === "true" ||
        l.available === undefined,
    );

    // Destination Search
    if (destination) {
      filtered = filtered.filter(
        (listing) =>
          listing.name?.toLowerCase().includes(destination.toLowerCase()) ||
          listing.address?.toLowerCase().includes(destination.toLowerCase()) ||
          listing.category?.toLowerCase().includes(destination.toLowerCase()),
      );
    }

    // Category Filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (l) =>
          l.category &&
          l.category.trim().toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Price Filter
    const minPrice = 0;
    const maxPriceValue = Number.isFinite(Number(maxPrice))
      ? Number(maxPrice)
      : Infinity;

    filtered = filtered.filter((l) => {
      const price = Number(l.price || 0);
      return price >= minPrice && price <= maxPriceValue;
    });

    // Sorting
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      filtered.sort(
        (a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0),
      );
    }

    setFilteredListings(filtered);
  }, [listings, selectedCategory, maxPrice, sortBy, destination]);

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
    console.log("Current User :", user);
    console.log("User EMail :", user.email);
    const { name, checkIn, checkOut, guests, address } = bookingDetails;

    if (!name || !checkIn || !checkOut || !address) {
      alert("Please fill in all booking details including your name.");
      return;
    }

    const newBooking = {
      userName: name,
      userEmail: user.email || "",
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
      await axios.post(`${DB_URL}/bookings.json${authQuery}`, newBooking);
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

  const handleMaxPriceChange = (value) => {
    setMaxPrice(Number(value));
  };

  return (
    <>
      <UserNav />
      <div className="user-listings-container">
        <section className="ul-hero">
          <div className="ul-hero-content">
            <p className="ul-hero-badge">🌍 Explore Stays</p>
            <h2 className="listings-title">🏖 Available Listings</h2>
            <p className="ul-hero-subtitle">
              Handpicked destinations and stays to match your travel vibe.
            </p>
          </div>
        </section>

        <div className="ul-layout">
          <div className="ul-main">
            <div className="ul-toolbar">
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
              <div className="ul-price-range">
                <div className="range-label">Max Price: ₹{maxPrice}</div>
                <div className="range-inputs">
                  <input
                    type="range"
                    min="0"
                    max={maxListingPrice}
                    value={maxPrice}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="sort-box">
                <label>
                  Sort by
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </label>
              </div>
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
                        l.image && l.image.trim() !== ""
                          ? l.image
                          : FIXED_IMAGE_URL
                      }
                      alt={l.name || "Listing Image"}
                      className="listing-image"
                    />
                    <div className="listing-actions">
                      <button
                        type="button"
                        className="details-btn"
                        onClick={() => navigate(`/user/listings/${l.id}`)}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        className="book-now-btn"
                        onClick={() => openModal(l)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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
