import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import BackButton from "../components/BackButton";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function AccountRoute() {
  const navigate = useNavigate();
  const { candidate, setCandidate } = useAuth();

  const [accountFirstName, setAccountFirstName] = useState("");
  const [accountLastName, setAccountLastName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (candidate) {
      setAccountFirstName(candidate.firstName);
      setAccountLastName(candidate.lastName);
      setAccountEmail(candidate.email);
    }
  }, [candidate]);

  if (!candidate) {
    return <Navigate to="/" replace />;
  }

  const handleAccountSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveMessage(null);

    try {
      const res = await fetch(`${API_BASE}/candidates/${candidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: accountEmail,
          firstName: accountFirstName,
          lastName: accountLastName,
          headline: candidate.headline,
          summary: candidate.summary,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setCandidate(updated);
      setSaveMessage("Account updated.");
    } catch (err) {
      setError("Could not update account.");
    }
  };

  return (
    <>
      <Breadcrumbs path={["Home", "Account"]} />
      <h1>Account</h1>

      <form onSubmit={handleAccountSave} data-testid="account-form">
        <div>
          <label htmlFor="account-firstname-input">First Name</label>
          <input
            id="account-firstname-input"
            data-testid="account-firstname-input"
            type="text"
            value={accountFirstName}
            onChange={(e) => setAccountFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="account-lastname-input">Last Name</label>
          <input
            id="account-lastname-input"
            data-testid="account-lastname-input"
            type="text"
            value={accountLastName}
            onChange={(e) => setAccountLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="account-email-input">Email</label>
          <input
            id="account-email-input"
            data-testid="account-email-input"
            type="email"
            value={accountEmail}
            onChange={(e) => setAccountEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="account-password-input">Password</label>
          <input
            id="account-password-input"
            data-testid="account-password-input"
            type="password"
            value="••••••••"
            disabled
          />
          <span className="account-password-note">Coming soon</span>
        </div>
        <div className="form-actions">
          <BackButton onClick={() => navigate("/")} />
          <button type="submit" className="form-submit-button" data-testid="save-account-button">
            Save Account
          </button>
        </div>
      </form>

      {saveMessage && <p data-testid="save-message">{saveMessage}</p>}
      {error && (
        <p role="alert" data-testid="error-message">
          {error}
        </p>
      )}
    </>
  );
}

export default AccountRoute;