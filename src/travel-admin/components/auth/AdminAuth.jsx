// src/travel-admin/components/auth/AdminAuth.jsx

import AdminLogin from "./AdminLogin";
import "./AdminAuth.css";

function AdminAuth() {
  return (
    <div className="admin-auth-page">
      <div className="admin-auth-container">
        <div className="admin-auth-card">
          <AdminLogin />
        </div>
      </div>
    </div>
  );
}

export default AdminAuth;
