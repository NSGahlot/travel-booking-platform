// src/travel-user/components/auth/UserSignup.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../../api/firebaseUserAuth";
import { setUser } from "../../../features/user/userSlice";
import "./UserSignUp.css";

function UserSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await signupUser(email, password);
      localStorage.setItem("userToken", res.idToken);
      dispatch(setUser({ email, token: res.idToken }));
      navigate("/user/home");
    } catch (err) {
      setError("Signup failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="user-signup-card">
      <h2 className="user-signup-title">User Signup</h2>
      <form onSubmit={handleSignup} className="user-signup-form">
        <label className="user-signup-label" htmlFor="user-signup-email">
          Email
        </label>
        <input
          id="user-signup-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="user-signup-input"
          autoComplete="email"
          aria-invalid={Boolean(error)}
        />

        <label className="user-signup-label" htmlFor="user-signup-password">
          Password
        </label>
        <input
          id="user-signup-password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="user-signup-input"
          autoComplete="new-password"
          aria-invalid={Boolean(error)}
        />

        <button type="submit" className="user-signup-btn">
          Signup
        </button>
      </form>

      {error && (
        <p className="user-signup-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

export default UserSignup;
