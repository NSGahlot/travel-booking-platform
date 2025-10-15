import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← add this
import { signupAdmin } from "../../../api/firebaseAuth";
import { setAdmin } from "../../../features/admin/adminSlice";
import { useDispatch } from "react-redux";

function AdminSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ← useNavigate hook
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
      const res = await signupAdmin(email, password);
      dispatch(setAdmin({ email, token: res.idToken }));
      localStorage.setItem("adminToken", res.idToken);

      setSuccess("Admin account created successfully!");
      setError("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/admin/dashboard"); // ← redirect to dashboard
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div style={{ width: "320px", margin: "100px auto" }}>
      <h2>Admin Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Signup</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default AdminSignup;
