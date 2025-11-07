import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminSignup from "./AdminSignup";

function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div>
      {isLogin ? <AdminLogin /> : <AdminSignup />}
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={toggleAuth}>
          {isLogin ? "Sign up here" : "Login here"}
        </button>
      </p>
    </div>
  );
}

export default AdminAuth;
