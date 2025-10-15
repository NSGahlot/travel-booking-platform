import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../api/firebaseUserAuth"; // 👈 updated import
import { setUser } from "../../../features/user/userSlice";

function UserLogin() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      localStorage.setItem("userToken", res.idToken);
      dispatch(setUser({ email, token: res.idToken }));
      window.location.href = "/user/home";
    } catch (err) {
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div style={{ width: "300px", margin: "100px auto" }}>
      <h2>User Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="User Password"
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

export default UserLogin;
