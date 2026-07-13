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

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter email and password.");
      return;
    }

    // Sirf ye email allow hoga
    if (email !== "traveladmin@gmail.com") {
      toast.error("You are not authorized as Admin.");
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
