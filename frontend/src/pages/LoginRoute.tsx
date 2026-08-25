import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import BackButton from "../components/BackButton";

function LoginRoute() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, firstName, lastName);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      <Breadcrumbs path={["Home", mode === "login" ? "Log In" : "Sign Up"]} />
      <h1>Goyeni</h1>
      <section aria-label={mode === "login" ? "Login" : "Sign Up"}>
        <div className="auth-mode-toggle">
          <button
            type="button"
            className={mode === "login" ? "auth-mode-active" : ""}
            onClick={() => setMode("login")}
            data-testid="mode-login-button"
          >
            Log In
          </button>
          <button
            type="button"
            className={mode === "signup" ? "auth-mode-active" : ""}
            onClick={() => setMode("signup")}
            data-testid="mode-signup-button"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} data-testid="login-form">
          {mode === "signup" && (
            <>
              <div>
                <label htmlFor="login-firstname-input">First Name</label>
                <input
                  id="login-firstname-input"
                  data-testid="login-firstname-input"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="login-lastname-input">Last Name</label>
                <input
                  id="login-lastname-input"
                  data-testid="login-lastname-input"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="login-email-input">Email</label>
            <input
              id="login-email-input"
              data-testid="login-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="login-password-input">Password</label>
            <input
              id="login-password-input"
              data-testid="login-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <BackButton onClick={() => navigate("/")} />
            <button type="submit" className="form-submit-button" data-testid="login-button">
              {mode === "login" ? "Log In" : "Sign Up"}
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