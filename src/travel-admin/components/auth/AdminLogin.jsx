// src/travel-admin/components/auth/AdminLogin.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdmin } from "../../../features/admin/adminSlice";
import axios from "axios";

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
      // ✅ Fetch all admins from DB
      const res = await axios.get(`${DB_URL}/admins.json`);
      if (!res.data) {
        alert("No admins found in database!");
        return;
      }

      // ✅ Convert object to array and check credentials
      const admins = Object.values(res.data);
      const admin = admins.find(
        (a) => a.email === email && a.password === password
      );

      if (admin) {
        // ✅ Store admin info in Redux + LocalStorage
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
    <div>
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AdminLogin;
