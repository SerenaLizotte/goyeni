import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import BackButton from "../components/BackButton";

function LoginRoute() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginFirstName, setLoginFirstName] = useState("");
  const [loginLastName, setLoginLastName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(loginEmail, loginFirstName, loginLastName);
      navigate("/profile");
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
            <label htmlFor="login-firstname-input">First Name (if new)</label>
            <input
              id="login-firstname-input"
              data-testid="login-firstname-input"
              type="text"
              value={loginFirstName}
              onChange={(e) => setLoginFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="login-lastname-input">Last Name (if new)</label>
            <input
              id="login-lastname-input"
              data-testid="login-lastname-input"
              type="text"
              value={loginLastName}
              onChange={(e) => setLoginLastName(e.target.value)}
            />
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