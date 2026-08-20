import "./LandingNav.css";

function LandingNav() {
  return (
    <div className="landing-nav">
      <div className="landing-nav-logo">
        <div className="landing-nav-logo-mark">G</div>
        <span className="landing-nav-logo-text">goyeni</span>
      </div>
      <div className="landing-nav-links">
        <a href="#" className="landing-nav-link">
          For Candidates
        </a>
        <a href="#" className="landing-nav-link">
          For Recruiters
        </a>
      </div>
      <div className="landing-nav-actions">
        <button className="landing-nav-login" data-testid="nav-login-button">
          Log In
        </button>
        <button className="landing-nav-signup" data-testid="nav-signup-button">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default LandingNav;