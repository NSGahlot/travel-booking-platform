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

      dispatch(
        setUser({
          email: res.email || email,
          token: res.idToken,
        }),
      );

      navigate("/user/home");
    } catch (err) {
      console.error(err);

      if (err.message?.includes("INVALID_LOGIN_CREDENTIALS")) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="user-login-card">
      <h2 className="user-login-title">User Login</h2>
      <form onSubmit={handleLogin} className="user-login-form">
        <label className="user-login-label" htmlFor="user-login-email">
          Email
        </label>
        <input
          id="user-login-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="user-login-input"
          autoComplete="email"
          aria-invalid={Boolean(error)}
        />

        <label className="user-login-label" htmlFor="user-login-password">
          Password
        </label>
        <input
          id="user-login-password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="user-login-input"
          autoComplete="current-password"
          aria-invalid={Boolean(error)}
        />

        <button type="submit" className="user-login-btn">
          Login
        </button>
      </form>

      {error && (
        <p className="user-login-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

export default UserLogin;
