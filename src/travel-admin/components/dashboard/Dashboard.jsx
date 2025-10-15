import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../features/admin/adminSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    dispatch(logoutAdmin());
    navigate("/admin/auth");
  };

  return (
    <div style={{ width: "600px", margin: "50px auto", textAlign: "center" }}>
      <h2>Welcome to Admin Dashboard</h2>
      <p>You are logged in successfully!</p>

      <div style={{ marginTop: "30px" }}>
        <p>
          <Link
            to="/admin/categories"
            style={{
              textDecoration: "none",
              background: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              margin: "5px",
              display: "inline-block",
            }}
          >
            Manage Categories
          </Link>
        </p>

        <p>
          <Link
            to="/admin/listings"
            style={{
              textDecoration: "none",
              background: "#2196F3",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              margin: "5px",
              display: "inline-block",
            }}
          >
            Manage Listings
          </Link>
        </p>

        <p>
          <Link
            to="/admin/bookings"
            style={{
              textDecoration: "none",
              background: "#FF9800",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              margin: "5px",
              display: "inline-block",
            }}
          >
            Manage Bookings
          </Link>
        </p>

        <p>
          <button
            onClick={handleLogout}
            style={{
              background: "#f44336",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Logout
          </button>
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
