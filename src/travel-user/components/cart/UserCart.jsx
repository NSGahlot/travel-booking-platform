import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { addBooking } from "../../../features/user/bookingSlice";
import {
  removeFromCart,
  updateCartItem,
} from "../../../features/user/cartSlice";
import "./UserCart.css";
import UserNav from "../UserNav";

const DB_URL = "https://travel-app-2d78a-default-rtdb.firebaseio.com";
const DAY_IN_MS = 1000 * 60 * 60 * 24;

const parseDateInput = (value) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const formatDate = (value) => {
  const date = parseDateInput(value);

  if (!date) {
    return value || "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

function UserCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.user);
  const userToken = useSelector((state) => state.user.token);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirmingItemId, setIsConfirmingItemId] = useState(null);
  const authQuery = userToken ? `?auth=${userToken}` : "";

  const fetchApprovedBookings = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.get(`${DB_URL}/bookings.json${authQuery}`);
      if (res.data) {
        const allBookings = Object.entries(res.data).map(([id, value]) => ({
          id,
          ...value,
        }));

        const approved = allBookings.filter(
          (b) => b.status === "Approved" && b.userEmail === user.email,
        );

        setApprovedBookings(approved);
      } else {
        setApprovedBookings([]);
      }
    } catch (err) {
      console.error(err);
      setError("We couldn't load your cart right now. Please try again.");
      setApprovedBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [user.email, authQuery]);

  useEffect(() => {
    fetchApprovedBookings();
  }, [fetchApprovedBookings]);

  const getStaySummary = useCallback((item) => {
    if (!item.checkIn || !item.checkOut) {
      return null;
    }

    const checkInDate = parseDateInput(item.checkIn);
    const checkOutDate = parseDateInput(item.checkOut);

    if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
      return null;
    }

    const totalNights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / DAY_IN_MS,
    );
    const pricePerNight = Number(item.price) || 0;
    const totalPrice = pricePerNight * totalNights;

    return { totalNights, pricePerNight, totalPrice };
  }, []);

  const cartSummary = cartItems.reduce((sum, item) => {
    const summary = getStaySummary(item);
    return sum + (summary ? summary.totalPrice : 0);
  }, 0);

  const handleConfirmBooking = async (item) => {
    setError("");
    setSuccessMessage("");

    if (!user.email) {
      setError("Please sign in before confirming a booking.");
      return;
    }

    if (!item.checkIn || !item.checkOut) {
      setError(
        `Please choose both check-in and check-out dates for ${item.listingName || "this stay"}.`,
      );
      return;
    }

    if (!item.guests || Number(item.guests) < 1) {
      setError("Please choose at least one guest before confirming.");
      return;
    }

    const summary = getStaySummary(item);
    if (!summary) {
      setError("Check-out must be after check-in.");
      return;
    }

    const bookingData = {
      listingId: item.id,
      listingName: item.listingName,
      price: item.price,
      address: item.address,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      guests: Number(item.guests),
      totalNights: summary.totalNights,
      totalPrice: summary.totalPrice,
      pricePerNight: summary.pricePerNight,
      userName: item.userName || user.name || "Guest",
      userId: user.id,
      userEmail: user.email,
      status: "Pending",
      bookedAt: new Date().toISOString(),
    };

    setIsConfirmingItemId(item.id);

    try {
      await axios.post(`${DB_URL}/bookings.json${authQuery}`, bookingData);
      dispatch(addBooking(bookingData));
      dispatch(removeFromCart(item.id));
      setSuccessMessage(`Your stay at ${item.listingName} has been confirmed.`);
      await fetchApprovedBookings();
    } catch (err) {
      console.error(err);
      setError("We couldn't confirm this booking. Please try again.");
    } finally {
      setIsConfirmingItemId(null);
    }
  };

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  const combinedItems = [...cartItems, ...approvedBookings];

  return (
    <>
      <UserNav />

      <div className="cart-page">
        <h3>Your Cart & Confirmed Bookings</h3>
        <p className="cart-page-subtitle">
          Choose your dates and guest count before confirming each stay.
        </p>

        {isLoading ? (
          <p className="cart-empty">Loading your cart...</p>
        ) : error ? (
          <div className="cart-empty">
            {error}
            <div style={{ marginTop: "8px" }}>
              <button
                type="button"
                className="btn btn-checkout"
                onClick={() => fetchApprovedBookings()}
              >
                Try again
              </button>
            </div>
          </div>
        ) : combinedItems.length === 0 ? (
          <p className="cart-empty">
            Your cart is empty. Add a listing to start planning your trip.
          </p>
        ) : null}

        {successMessage ? (
          <div className="cart-success">{successMessage}</div>
        ) : null}

        {combinedItems.length > 0 && (
          <div className="cart-layout">
            <div className="cart-left">
              {combinedItems.map((item) => {
                const isInCart = cartItems.some(
                  (cartItem) => cartItem.id === item.id,
                );
                const staySummary = getStaySummary(item);

                return (
                  <div key={item.id} className="cart-card">
                    <div className="cart-item-header">
                      <div>
                        <p className="cart-item-title">
                          <strong>{item.listingName}</strong>
                        </p>
                        <p className="cart-item-meta">
                          {item.address ||
                            item.location ||
                            "Choose your travel dates"}
                        </p>
                      </div>
                      {isInCart ? (
                        <span className="cart-badge">Pending</span>
                      ) : (
                        <span className="approved-status">Confirmed</span>
                      )}
                    </div>

                    <div className="cart-card-body">
                      <p className="cart-item-price">
                        Price per Night: ₹{formatCurrency(item.price)}
                      </p>

                      <div className="cart-meta-grid">
                        <div className="cart-meta-item">
                          <span className="cart-meta-label">Check-in</span>
                          <span>{formatDate(item.checkIn)}</span>
                        </div>
                        <div className="cart-meta-item">
                          <span className="cart-meta-label">Check-out</span>
                          <span>{formatDate(item.checkOut)}</span>
                        </div>
                        <div className="cart-meta-item">
                          <span className="cart-meta-label">Guests</span>
                          <span>{item.guests || 1}</span>
                        </div>
                        <div className="cart-meta-item">
                          <span className="cart-meta-label">Traveler</span>
                          <span>{item.userName || user.name || "Guest"}</span>
                        </div>
                      </div>
                    </div>

                    {isInCart ? (
                      <>
                        <div className="cart-form-grid">
                          <label
                            className="cart-field"
                            htmlFor={`cart-check-in-${item.id}`}
                          >
                            Check In
                            <input
                              id={`cart-check-in-${item.id}`}
                              name="checkIn"
                              type="date"
                              value={item.checkIn || ""}
                              min={new Date().toISOString().split("T")[0]}
                              onChange={(e) =>
                                dispatch(
                                  updateCartItem({
                                    id: item.id,
                                    data: { checkIn: e.target.value },
                                  }),
                                )
                              }
                              className="cart-input"
                            />
                          </label>

                          <label
                            className="cart-field"
                            htmlFor={`cart-check-out-${item.id}`}
                          >
                            Check Out
                            <input
                              id={`cart-check-out-${item.id}`}
                              name="checkOut"
                              type="date"
                              value={item.checkOut || ""}
                              min={
                                item.checkIn ||
                                new Date().toISOString().split("T")[0]
                              }
                              onChange={(e) =>
                                dispatch(
                                  updateCartItem({
                                    id: item.id,
                                    data: { checkOut: e.target.value },
                                  }),
                                )
                              }
                              className="cart-input"
                            />
                          </label>

                          <label
                            className="cart-field"
                            htmlFor={`cart-guests-${item.id}`}
                          >
                            Guests
                            <input
                              id={`cart-guests-${item.id}`}
                              name="guests"
                              type="number"
                              min="1"
                              value={item.guests || 1}
                              onChange={(e) =>
                                dispatch(
                                  updateCartItem({
                                    id: item.id,
                                    data: { guests: Number(e.target.value) },
                                  }),
                                )
                              }
                              className="cart-input cart-input-number"
                            />
                          </label>

                          <label
                            className="cart-field"
                            htmlFor={`cart-user-name-${item.id}`}
                          >
                            Traveler Name
                            <input
                              id={`cart-user-name-${item.id}`}
                              name="userName"
                              type="text"
                              value={item.userName || user.name || ""}
                              onChange={(e) =>
                                dispatch(
                                  updateCartItem({
                                    id: item.id,
                                    data: { userName: e.target.value },
                                  }),
                                )
                              }
                              className="cart-input"
                            />
                          </label>
                        </div>

                        {staySummary ? (
                          <div className="cart-summary-box">
                            <p>
                              <strong>Stay summary</strong>
                            </p>
                            <p>
                              {staySummary.totalNights} night
                              {staySummary.totalNights > 1 ? "s" : ""} • ₹
                              {staySummary.pricePerNight} / night
                            </p>
                            <p className="cart-summary-total">
                              Estimated total: ₹{staySummary.totalPrice}
                            </p>
                          </div>
                        ) : (
                          <div className="cart-summary-box cart-summary-note">
                            Select a valid date range to see your estimated
                            total.
                          </div>
                        )}

                        <div className="cart-actions">
                          <button
                            type="button"
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="btn btn-remove"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmBooking(item)}
                            className="btn btn-confirm"
                            disabled={isConfirmingItemId === item.id}
                          >
                            {isConfirmingItemId === item.id
                              ? "Confirming..."
                              : "Confirm Booking"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="cart-confirmed-details">
                        <p className="cart-item-date-range">
                          {formatDate(item.checkIn)} →{" "}
                          {formatDate(item.checkOut)}
                        </p>
                        <p className="cart-item-guest-count">
                          Guests: {item.guests || 1}
                        </p>
                        <p className="cart-item-guest-count">
                          Nights:{" "}
                          {item.totalNights ?? staySummary?.totalNights ?? "—"}{" "}
                          • Total Price: ₹
                          {formatCurrency(
                            item.totalPrice ??
                              staySummary?.totalPrice ??
                              item.price,
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {cartItems.length > 0 ? (
              <div className="cart-right">
                <div className="summary-card">
                  <h3>Trip summary</h3>
                  <div className="summary-row">
                    <span>Pending stays</span>
                    <span>{cartItems.length}</span>
                  </div>
                  <div className="summary-row">
                    <span>Estimated total</span>
                    <span>₹{formatCurrency(cartSummary)}</span>
                  </div>
                  <p className="summary-note">
                    Confirming a stay moves it into your bookings and removes it
                    from the cart.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}

export default UserCart;
