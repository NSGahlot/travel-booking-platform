// src/travel-user/components/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function UserProtectedRoute({ children }) {
  const token = useSelector((state) => state.user.token);

  if (!token) return <Navigate to="/user/login" replace />;

  return children;
}

export default UserProtectedRoute;
