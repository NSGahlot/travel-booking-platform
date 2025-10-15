import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminSignup from "./AdminSignup";

function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {isLogin ? <AdminLogin /> : <AdminSignup />}
      <p style={{ marginTop: "20px" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={toggleAuth} style={{ cursor: "pointer" }}>
          {isLogin ? "Sign up here" : "Login here"}
        </button>
      </p>
    </div>
  );
}

export default AdminAuth;
