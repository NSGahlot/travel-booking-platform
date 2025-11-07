// src/travel-user/components/auth/UserAuth.jsx

import { useState } from "react";
import UserLogin from "./UserLogin";
import UserSignup from "./UserSignup";
import "./UserAuth.css"; // 👈 CSS import

function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const toggleAuth = () => setIsLogin((prev) => !prev);

  return (
    <div className="user-auth-page">
      <div className="user-auth-container">
        <div className="user-auth-card">
          {isLogin ? <UserLogin /> : <UserSignup />}

          <div className="user-auth-toggle">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button onClick={toggleAuth} className="toggle-btn">
              {isLogin ? "Sign up here" : "Login here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;
