// src/travel-user/components/UserLayout.jsx
import UserNav from "./UserNav";
import UserFooter from "./UserFooter";

function UserLayout({ children }) {
  return (
    <div>
      {/* <UserNav /> */}
      <main>{children}</main>
      <UserFooter />
    </div>
  );
}

export default UserLayout;
