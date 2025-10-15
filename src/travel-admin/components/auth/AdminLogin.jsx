import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../../../api/firebaseAuth";
import { setAdmin } from "../../../features/admin/adminSlice";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAdmin(email, password);
      localStorage.setItem("adminToken", res.idToken);

      dispatch(setAdmin({ email, token: res.idToken }));
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div style={{ width: "300px", margin: "100px auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
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
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AdminLogin;
