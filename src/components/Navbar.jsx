// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  const hideNavbar = ["/choose-role", "/admin/auth", "/user/login"].includes(
    location.pathname
  );
  if (hideNavbar) return null;

  return (
    <nav className="navbar">
      <Link to="/choose-role" className="navbar-logo">
        Travel Portal
      </Link>

      <div className="navbar-links">
        <Link to="/admin/auth" className="navbar-link">
          Admin
        </Link>
        <Link to="/user/login" className="navbar-link">
          User
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
