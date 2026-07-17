// src/travel-admin/components/auth/AdminLogin.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdmin } from "../../../features/admin/adminSlice";
import { loginAdmin } from "../../../api/firebaseAuth";
import toast from "react-hot-toast";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    // Sirf ye email allow hoga
    if (email !== "traveladmin@gmail.com") {
      toast.error("This email is not authorized for admin access.");
      return;
    }

    try {
      const res = await loginAdmin(email, password);

      dispatch(
        setAdmin({
          email: res.email,
          token: res.idToken,
        }),
      );

      localStorage.setItem("adminToken", res.idToken);

      toast.success("Admin login successful.");

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid Admin Password.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">🛫</div>
          <h2>Admin Login</h2>
          <p className="admin-login-subtitle">
            Sign in to manage categories, listings and bookings.
          </p>
        </div>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <label className="admin-login-label" htmlFor="admin-email">
            Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            className="admin-login-input"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <label className="admin-login-label" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            className="admin-login-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button type="submit" className="admin-login-btn">
            Login
          </button>
        </form>

        <p className="admin-login-hint">
          Tip: Use your registered admin email & password.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
