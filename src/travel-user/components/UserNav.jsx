import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/user/userSlice";
import "./UserNav.css";

function UserNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const cartCount = useSelector((state) => state.cart.cartItems?.length || 0);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/user/login");
  };

  const toggleCart = () => {
    window.dispatchEvent(new CustomEvent("toggle-cart"));
  };

  return (
    <nav className="user-nav">
      <div className="user-nav-logo" onClick={() => navigate("/user/home")}>
        🌍 Travel Explorer
      </div>

      <div className="user-nav-links">
        <span onClick={() => navigate("/user/home")}>Home</span>
        <span onClick={() => navigate("/user/listings")}>Listings</span>
        <span onClick={() => navigate("/user/bookings")}>Bookings</span>

        <button type="button" className="nav-cart-btn" onClick={toggleCart}>
          🛒 Cart
          {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        </button>
      </div>

      <div className="user-nav-right">
        {user?.email && <span className="user-email">👤 {user.email}</span>}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default UserNav;
