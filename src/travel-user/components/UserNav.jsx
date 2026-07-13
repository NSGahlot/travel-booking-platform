import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
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

  return (
    <nav className="user-nav">
      <div className="user-nav-logo" onClick={() => navigate("/user/home")}>
        🌍 Travel Explorer
      </div>

      <div className="user-nav-links">
        <NavLink
          to="/user/home"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          🏠 Home
        </NavLink>
        <NavLink
          to="/user/listings"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          🧭 Listings
        </NavLink>
        <NavLink
          to="/user/bookings"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          📘 Bookings
        </NavLink>

        <NavLink
          to="/user/cart"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          🛒 Cart
          {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        </NavLink>
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
