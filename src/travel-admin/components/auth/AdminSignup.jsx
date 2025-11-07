// src/travel-admin/components/auth/AdminSignup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdmin } from "../../../features/admin/adminSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const DB_URL =
  "https://travel-website-project-27e70-default-rtdb.firebaseio.com";

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
      return;
    }

    try {
      // ✅ Save admin in Firebase Realtime Database
      const newAdmin = { email, password };
      await axios.post(`${DB_URL}/admins.json`, newAdmin);

      // ✅ Store admin info in Redux + LocalStorage
      dispatch(setAdmin({ email, token: Date.now() }));
      localStorage.setItem("adminToken", Date.now());

      setSuccess("Admin account created successfully!");
      setError("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // ✅ Redirect to Dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div>
      <h2>Admin Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
}

export default AdminSignup;
