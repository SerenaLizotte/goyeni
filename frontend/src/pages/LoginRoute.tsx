import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import BackButton from "../components/BackButton";

function LoginRoute() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(loginEmail, "", "");
      navigate("/dashboard");
    } catch (err) {
      setError("Could not log in. Is the backend running?");
    }
  };

  return (
    <>
      <Breadcrumbs path={["Home", "Log In"]} />
      <h1>Goyeni</h1>
      <section aria-label="Login">
        <h2>Log In</h2>
        <p>Enter your email. If you're new, we'll create your profile.</p>
        <form onSubmit={handleLogin} data-testid="login-form">
          <div>
            <label htmlFor="login-email-input">Email</label>
            <input
              id="login-email-input"
              data-testid="login-email-input"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="login-password-input">Password</label>
            <input
              id="login-password-input"
              data-testid="login-password-input"
              type="password"
              value="••••••••"
              disabled
            />
            <span className="account-password-note">Coming soon</span>
          </div>
          <div className="form-actions">
            <BackButton onClick={() => navigate("/")} />
            <button type="submit" className="form-submit-button" data-testid="login-button">
              Log In
            </button>
          </div>
        </form>
        {error && (
          <p role="alert" data-testid="error-message">
            {error}
          </p>
        )}
      </section>
    </>
  );
}

export default LoginRoute;