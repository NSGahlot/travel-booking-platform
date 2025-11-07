import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../features/admin/adminSlice";
import "./Dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    dispatch(logoutAdmin());
    navigate("/admin/auth");
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome to Admin Dashboard</h2>
      <p className="dashboard-subtitle">You are logged in successfully!</p>

      <div className="dashboard-links">
        <p>
          <Link to="/admin/categories" className="dashboard-link green">
            Manage Categories
          </Link>
        </p>

        <p>
          <Link to="/admin/listings" className="dashboard-link blue">
            Manage Listings
          </Link>
        </p>

        <p>
          <Link to="/admin/bookings" className="dashboard-link orange">
            Manage Bookings
          </Link>
        </p>

        <p>
          <button onClick={handleLogout} className="logout-btn red">
            Logout
          </button>
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
