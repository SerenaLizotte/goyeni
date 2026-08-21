import "./AppNav.css";

interface AppNavProps {
  isLoggedIn: boolean;
  initials?: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

function AppNav({ isLoggedIn, initials, onLoginClick, onLogoutClick }: AppNavProps) {
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
        <a href="#" className="app-nav-link">
          Recruiter
        </a>
        <a href="#" className="app-nav-link">
          About
        </a>
        <a href="#" className="app-nav-link">
          Contact
        </a>
      </div>
      <div className="app-nav-actions">
        {isLoggedIn && initials && (
          <span className="app-nav-initials" data-testid="nav-avatar">
            {initials}
          </span>
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