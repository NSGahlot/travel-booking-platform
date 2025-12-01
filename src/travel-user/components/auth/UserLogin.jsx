// src/travel-user/components/auth/UserLogin.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../api/firebaseUserAuth";
import { setUser } from "../../../features/user/userSlice";
import "./UserLogin.css";

function UserLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      localStorage.setItem("userToken", res.idToken);
      dispatch(setUser({ email, token: res.idToken }));
      navigate("/user/home");
    } catch (err) {
      setError("Invalid credentials. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="user-login-card">
      <h2 className="user-login-title">User Login</h2>
      <form onSubmit={handleLogin} className="user-login-form">
        <label className="user-login-label">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="user-login-input"
        />

        <label className="user-login-label">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="user-login-input"
        />

        <button type="submit" className="user-login-btn">
          Login
        </button>
      </form>

      {error && <p className="user-login-error">{error}</p>}
    </div>
  );
}

export default UserLogin;
