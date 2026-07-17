// src/travel-admin/components/auth/AdminSignup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdmin } from "../../../features/admin/adminSlice";
import { useDispatch } from "react-redux";
import { signupAdmin } from "../../../api/firebaseAuth";
import "./AdminSignup.css"; // 👈 add this

function AdminSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    try {
      const res = await signupAdmin(email, password);

      dispatch(setAdmin({ email: res.email, token: res.idToken }));
      localStorage.setItem("adminToken", res.idToken);

      setSuccess("Admin account created successfully!");
      setError("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setSuccess("");
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="admin-signup-page">
      <div className="admin-signup-card">
        <div className="admin-signup-header">
          <div className="admin-signup-logo">🛫</div>
          <h2>Create Admin Account</h2>
          <p className="admin-signup-subtitle">
            Register to manage categories, listings & bookings.
          </p>
        </div>

        <form onSubmit={handleSignup} className="admin-signup-form">
          <label className="admin-signup-label" htmlFor="admin-signup-email">
            Email
          </label>
          <input
            id="admin-signup-email"
            name="email"
            type="email"
            className="admin-signup-input"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label className="admin-signup-label" htmlFor="admin-signup-password">
            Password
          </label>
          <input
            id="admin-signup-password"
            name="password"
            type="password"
            className="admin-signup-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <label
            className="admin-signup-label"
            htmlFor="admin-signup-confirm-password"
          >
            Confirm Password
          </label>
          <input
            id="admin-signup-confirm-password"
            name="confirmPassword"
            type="password"
            className="admin-signup-input"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <button type="submit" className="admin-signup-btn">
            Signup
          </button>

          {error && (
            <p
              className="admin-signup-alert error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}
          {success && (
            <p className="admin-signup-alert success" aria-live="polite">
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AdminSignup;
