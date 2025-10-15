// src/components/ChooseRole.jsx
import { useNavigate } from "react-router-dom";

function ChooseRole() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Choose Your Role</h2>
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/admin/auth")}
          style={{ marginRight: "20px", padding: "10px 20px" }}
        >
          Admin
        </button>
        <button
          onClick={() => navigate("/user/login")}
          style={{ padding: "10px 20px" }}
        >
          User
        </button>
      </div>
    </div>
  );
}

export default ChooseRole;
