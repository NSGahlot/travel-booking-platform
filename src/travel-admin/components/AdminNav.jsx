// src/travel-admin/components/AdminNav.jsx
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../features/admin/adminSlice";
import "./AdminNav.css";

function AdminNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    localStorage.removeItem("adminToken");
    navigate("/admin/auth");
  };

  return (
    <nav className="admin-nav">
      {/* Left Logo */}
      <div className="admin-logo" onClick={() => navigate("/admin/dashboard")}>
        🛫 Admin Panel
      </div>

      {/* Middle Links */}
      <div className="admin-links">
        <span onClick={() => navigate("/admin/dashboard")}>Dashboard</span>
        <span onClick={() => navigate("/admin/categories")}>Categories</span>
        <span onClick={() => navigate("/admin/listings")}>Listings</span>
        <span onClick={() => navigate("/admin/bookings")}>Bookings</span>
      </div>

      {/* Right: Admin info + Logout */}
      <div className="admin-right">
        {admin?.email && <span className="admin-email">👤 {admin.email}</span>}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNav;
