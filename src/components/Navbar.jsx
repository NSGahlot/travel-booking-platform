import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const hideNavbar = ["/choose-role", "/admin/auth", "/user/login"].includes(
    location.pathname
  );
  if (hideNavbar) return null;

  return (
    <nav
      style={{
        background: "#333",
        color: "#fff",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Link to="/choose-role" style={{ color: "#fff", textDecoration: "none" }}>
        Travel Portal
      </Link>
      <div>
        <Link to="/admin/auth" style={{ color: "#fff", marginRight: "15px" }}>
          Admin
        </Link>
        <Link to="/user/login" style={{ color: "#fff" }}>
          User
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
