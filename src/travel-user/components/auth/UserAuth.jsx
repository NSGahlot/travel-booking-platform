// src/travel-user/components/auth/UserAuth.jsx

import { useState } from "react";
import UserLogin from "./UserLogin";
import UserSignup from "./UserSignup";

function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => setIsLogin((prev) => !prev);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {isLogin ? <UserLogin /> : <UserSignup />}
      <p style={{ marginTop: "20px" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={toggleAuth} style={{ cursor: "pointer" }}>
          {isLogin ? "Sign up here" : "Login here"}
        </button>
      </p>
    </div>
  );
}

export default UserAuth; // ✅ Make sure this line exists
