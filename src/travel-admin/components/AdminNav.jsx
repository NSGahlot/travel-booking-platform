import { Link } from "react-router-dom";

function AdminNav() {
  const linkStyle = {
    textDecoration: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: "5px",
    margin: "5px",
    display: "inline-block",
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <Link
        to="/admin/dashboard"
        style={{ ...linkStyle, background: "#4CAF50" }}
      >
        Dashboard
      </Link>
      <Link
        to="/admin/categories"
        style={{ ...linkStyle, background: "#2196F3" }}
      >
        Categories
      </Link>
      <Link
        to="/admin/listings"
        style={{ ...linkStyle, background: "#FF9800" }}
      >
        Listings
      </Link>
      <Link
        to="/admin/bookings"
        style={{ ...linkStyle, background: "#9C27B0" }}
      >
        Bookings
      </Link>
    </div>
  );
}

export default AdminNav;
