// src/travel-user/components/UserListings.jsx
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserNav from "../UserNav";
import "./UserListings.css";
import { useDispatch } from "react-redux";
import { toggleWishlist } from "../../../features/user/wishlistSlice";
import toast from "react-hot-toast";

const DB_URL = "https://travel-app-2d78a-default-rtdb.firebaseio.com";
const FIXED_IMAGE_URL =
  "https://static2.tripoto.com/media/filter/nl/img/2025875/TripDocument/1601531054_these_traveling_tips_helps_me_having_hassle_free_journey.jpg";

function UserListings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.items);

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(10000);
  const nameInputRef = useRef(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    address: "",
  });

  const today = new Date().toISOString().split("T")[0];
  const categories = ["All", ...adminCategories];
  const authQuery = userToken ? `?auth=${userToken}` : "";

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.get(`${DB_URL}/listings.json${authQuery}`);
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
      setError("We couldn't load listings right now. Please try again.");
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [authQuery]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    if (modalOpen) {
      nameInputRef.current?.focus();
    }
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

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
    const { name, checkIn, checkOut, guests, address } = bookingDetails;
    setBookingError("");

    if (!name || !checkIn || !checkOut || !address) {
      setBookingError(
        "Please fill in all booking details including your name.",
      );
      toast.error("Please fill in all booking details including your name.");
      return;
    }

    if (checkIn < today) {
      setBookingError("Check-In date cannot be in the past.");
      toast.error("Check-In date cannot be in the past.");
      return;
    }

    if (checkOut <= checkIn) {
      setBookingError("Check-Out date must be after Check-In date.");
      toast.error("Check-Out date must be after Check-In date.");
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

    setIsBooking(true);

    try {
      await axios.post(`${DB_URL}/bookings.json${authQuery}`, newBooking);
      toast.success(
        "Booking request sent successfully! Waiting for admin approval.",
      );
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
      setBookingError("We couldn't submit your booking. Please try again.");
    } finally {
      setIsBooking(false);
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
                <label className="range-label" htmlFor="price-filter">
                  Max Price: ₹{maxPrice}
                </label>
                <div className="range-inputs">
                  <input
                    id="price-filter"
                    name="price"
                    type="range"
                    min="0"
                    max={maxListingPrice}
                    value={maxPrice}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="sort-box">
                <label htmlFor="sort-by">Sort by</label>
                <select
                  id="sort-by"
                  name="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="listings-grid">
              {isLoading ? (
                <p className="no-listings">Loading listings...</p>
              ) : error ? (
                <div className="no-listings">
                  {error}
                  <div style={{ marginTop: "8px" }}>
                    <button
                      type="button"
                      className="details-btn"
                      onClick={() => fetchListings()}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : filteredListings.length === 0 ? (
                <p className="no-listings">
                  No listings match your current search. Try a different filter.
                </p>
              ) : (
                filteredListings.map((l) => (
                  <div key={l.id} className="listing-card">
                    <button
                      className="wishlist-btn"
                      onClick={() => dispatch(toggleWishlist(l))}
                    >
                      {wishlist.some((item) => item.id === l.id) ? "❤️" : "🤍"}
                    </button>
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
          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            tabIndex={-1}
          >
            <h2 id="booking-modal-title">Book {currentListing.name}</h2>

            <label className="sr-only" htmlFor="booking-name">
              Your name
            </label>
            <input
              id="booking-name"
              ref={nameInputRef}
              type="text"
              placeholder="Enter your name"
              value={bookingDetails.name}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, name: e.target.value })
              }
              className="booking-input"
            />

            <label className="sr-only" htmlFor="booking-check-in">
              Check-in date
            </label>
            <input
              id="booking-check-in"
              name="checkIn"
              type="date"
              min={today}
              value={bookingDetails.checkIn}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  checkIn: e.target.value,
                })
              }
              className="booking-input"
            />

            <label className="sr-only" htmlFor="booking-check-out">
              Check-out date
            </label>
            <input
              id="booking-check-out"
              name="checkOut"
              type="date"
              min={bookingDetails.checkIn || today}
              value={bookingDetails.checkOut}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  checkOut: e.target.value,
                })
              }
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
              value={bookingDetails.guests}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  guests: Number(e.target.value),
                })
              }
              className="booking-input"
            />

            <label className="sr-only" htmlFor="booking-address">
              Address
            </label>
            <input
              id="booking-address"
              name="address"
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

            {bookingError && (
              <p className="no-listings" role="alert" aria-live="polite">
                {bookingError}
              </p>
            )}
            <div className="booking-buttons">
              <button
                onClick={() => setModalOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="confirm-btn"
                disabled={isBooking}
              >
                {isBooking ? "Submitting..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserListings;
