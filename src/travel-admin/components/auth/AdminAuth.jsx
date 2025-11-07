// src/travel-admin/components/auth/AdminAuth.jsx
import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminSignup from "./AdminSignup";
import "./AdminAuth.css"; // 👈 import CSS

function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-container">
        <div className="admin-auth-card">
          {isLogin ? <AdminLogin /> : <AdminSignup />}

          <div className="admin-auth-toggle">
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

export default AdminAuth;
