import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { addBooking } from "../../../features/user/bookingSlice";
import {
  clearCart,
  removeFromCart,
  updateCartItem,
} from "../../../features/user/cartSlice";
import "./UserCart.css";

const DB_URL = "https://travel-app-2d78a-default-rtdb.firebaseio.com";

function UserCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.user);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const toggle = () => setIsOpen((v) => !v);
    window.addEventListener("toggle-cart", toggle);
    return () => window.removeEventListener("toggle-cart", toggle);
  }, []);

  const fetchApprovedBookings = useCallback(async () => {
    try {
      const res = await axios.get(`${DB_URL}/bookings.json`);
      if (res.data) {
        const allBookings = Object.entries(res.data).map(([id, value]) => ({
          id,
          ...value,
        }));
        const approved = allBookings.filter(
          (b) => b.status === "Approved" && b.userId === user.id
        );
        setApprovedBookings(approved);
      }
    } catch (err) {
      console.error(err);
    }
  }, [user.id]);

  useEffect(() => {
    fetchApprovedBookings();
    const interval = setInterval(fetchApprovedBookings, 5000);
    return () => clearInterval(interval);
  }, [fetchApprovedBookings]);

  const totalAmount = [...cartItems, ...approvedBookings].reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const handleCheckout = async () => {
    try {
      for (let item of cartItems) {
        if (!item.checkIn || !item.checkOut || !item.userName) {
          alert("Please fill all details before checkout.");
          return;
        }

        const daysBooked =
          (new Date(item.checkOut) - new Date(item.checkIn)) /
          (1000 * 60 * 60 * 24);

        const bookingData = {
          listingId: item.id,
          listingName: item.listingName,
          price: item.price,
          address: item.address,
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          guests: item.guests,
          userName: item.userName || user.name || "Guest",
          userId: user.id,
          userEmail: user.email,
          status: "Pending",
          daysBooked: daysBooked > 0 ? daysBooked : 1,
        };

        await axios.post(`${DB_URL}/bookings.json`, bookingData);
        dispatch(addBooking(bookingData));
      }

      alert("Checkout successful!");
      dispatch(clearCart());
      fetchApprovedBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} className="cart-overlay" />
          <div className="cart-panel">
            <h3>Your Cart & Approved Bookings</h3>

            {[...cartItems, ...approvedBookings].length === 0 && (
              <p className="cart-empty">Cart is empty.</p>
            )}

            {[...cartItems, ...approvedBookings].map((item) => (
              <div key={item.id} className="cart-card">
                <p className="cart-item-title">
                  <strong>{item.listingName}</strong>
                </p>
                <p className="cart-item-price">Price: ₹{item.price}</p>

                {cartItems.includes(item) && (
                  <>
                    <p className="cart-field">
                      Check In:{" "}
                      <input
                        type="date"
                        value={item.checkIn}
                        onChange={(e) =>
                          dispatch(
                            updateCartItem({
                              id: item.id,
                              data: { checkIn: e.target.value },
                            })
                          )
                        }
                        className="cart-input"
                      />
                    </p>
                    <p className="cart-field">
                      Check Out:{" "}
                      <input
                        type="date"
                        value={item.checkOut}
                        onChange={(e) =>
                          dispatch(
                            updateCartItem({
                              id: item.id,
                              data: { checkOut: e.target.value },
                            })
                          )
                        }
                        className="cart-input"
                      />
                    </p>
                    <p className="cart-field">
                      Guests:{" "}
                      <input
                        type="number"
                        min="1"
                        value={item.guests}
                        onChange={(e) =>
                          dispatch(
                            updateCartItem({
                              id: item.id,
                              data: { guests: Number(e.target.value) },
                            })
                          )
                        }
                        className="cart-input cart-input-number"
                      />
                    </p>
                    <p className="cart-field">
                      User Name:{" "}
                      <input
                        type="text"
                        value={item.userName || user.name || ""}
                        onChange={(e) =>
                          dispatch(
                            updateCartItem({
                              id: item.id,
                              data: { userName: e.target.value },
                            })
                          )
                        }
                        className="cart-input"
                      />
                    </p>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="btn btn-remove"
                    >
                      Remove
                    </button>
                  </>
                )}

                {approvedBookings.includes(item) && (
                  <p className="approved-status">Status: Approved</p>
                )}
              </div>
            ))}

            {[...cartItems, ...approvedBookings].length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>Total: ₹{totalAmount}</strong>
              </div>
            )}

            {cartItems.length > 0 && (
              <button onClick={handleCheckout} className="btn btn-checkout">
                Checkout All
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default UserCart;
