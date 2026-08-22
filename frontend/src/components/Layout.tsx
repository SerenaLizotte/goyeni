import { Outlet, useNavigate } from "react-router";
import AppNav from "./AppNav";
import { useAuth } from "../AuthContext";
import "../App.css";

function Layout() {
  const navigate = useNavigate();
  const { isLoggedIn, initials, logout } = useAuth();

  return (
    <div className="app-container">
      <AppNav
        isLoggedIn={isLoggedIn}
        initials={initials}
        onLoginClick={() => navigate("/login")}
        onLogoutClick={() => {
          logout();
          navigate("/");
        }}
      />
      <Outlet />
    </div>
  );
}

export default Layout;