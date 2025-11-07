// src/travel-admin/components/auth/AdminLogin.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdmin } from "../../../features/admin/adminSlice";
import axios from "axios";
import "./AdminLogin.css"; // 👈 add this import

const DB_URL =
  "https://travel-website-project-27e70-default-rtdb.firebaseio.com";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await axios.get(`${DB_URL}/admins.json`);
      if (!res.data) {
        alert("No admins found in database!");
        return;
      }

      const admins = Object.values(res.data);
      const admin = admins.find(
        (a) => a.email === email && a.password === password
      );

      if (admin) {
        dispatch(setAdmin({ email: admin.email, token: Date.now() }));
        localStorage.setItem("adminToken", Date.now());
        navigate("/admin/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Check console.");
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

        <div className="admin-login-form">
          <label className="admin-login-label">
            Email
            <input
              type="email"
              className="admin-login-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="admin-login-label">
            Password
            <input
              type="password"
              className="admin-login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="admin-login-btn" onClick={handleLogin}>
            Login
          </button>
        </div>

        <p className="admin-login-hint">
          Tip: Use your registered admin email & password.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
