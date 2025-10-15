import { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../../../api/firebaseUserAuth"; // 👈 updated import
import { setUser } from "../../../features/user/userSlice";

function UserSignup() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await signupUser(email, password);
      localStorage.setItem("userToken", res.idToken);
      dispatch(setUser({ email, token: res.idToken }));
      window.location.href = "/user/home";
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div style={{ width: "300px", margin: "100px auto" }}>
      <h2>User Signup</h2>
      <form onSubmit={handleSignup}>
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Signup</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default UserSignup;
