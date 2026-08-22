import { Link } from "react-router";
import "./AppNav.css";

interface AppNavProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

function AppNav({ isLoggedIn, onLoginClick, onLogoutClick }: AppNavProps) {
  return (
    <div className="app-nav">
      <div className="app-nav-logo">
        <div className="app-nav-logo-mark">G</div>
        <span className="app-nav-logo-text">goyeni</span>
      </div>
      <div className="app-nav-links">
        <a href="#" className="app-nav-link">
          Candidate
        </a>
        <Link to="/recruiter" className="app-nav-link">
          Recruiter
        </Link>
        <Link to="/about" className="app-nav-link">
          About
        </Link>
        <Link to="/contact" className="app-nav-link">
          Contact
        </Link>
      </div>
      <div className="app-nav-actions">
        {isLoggedIn && (
          <Link to="/account" className="app-nav-initials" data-testid="nav-avatar">
            Account
          </Link>
        )}
        {isLoggedIn ? (
          <button
            className="app-nav-auth-link"
            onClick={onLogoutClick}
            data-testid="nav-logout-link"
          >
            Log Out
          </button>
        ) : (
          <button
            className="app-nav-auth-link"
            onClick={onLoginClick}
            data-testid="nav-login-link"
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
}

export default AppNav;