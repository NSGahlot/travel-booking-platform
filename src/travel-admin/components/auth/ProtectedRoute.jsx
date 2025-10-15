import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.admin.token);

  if (!token) {
    return <Navigate to="/admin/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;
