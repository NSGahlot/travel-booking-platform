// src/components/ChooseRole.jsx
import { useNavigate } from "react-router-dom";
import "./ChooseRole.css";

function ChooseRole() {
  const navigate = useNavigate();

  return (
    <div className="choose-role-container">
      <h2 className="choose-role-title">Choose Your Role</h2>

      <div className="choose-role-buttons">
        <button
          onClick={() => navigate("/admin/auth")}
          className="role-btn admin-btn"
        >
          Admin
        </button>
        <button
          onClick={() => navigate("/user/login")}
          className="role-btn user-btn"
        >
          User
        </button>
      </div>
    </div>
  );
}

export default ChooseRole;
