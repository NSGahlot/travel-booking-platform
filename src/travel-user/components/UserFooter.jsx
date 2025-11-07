// src/travel-user/components/UserFooter.jsx
import "./UserFooter.css";
function UserFooter() {
  return (
    <footer className="user-footer">
      🌍 Travel Explorer &copy; {new Date().getFullYear()} | All rights reserved
    </footer>
  );
}

export default UserFooter;
