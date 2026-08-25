import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import BackButton from "../components/BackButton";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function AccountRoute() {
  const navigate = useNavigate();
  const { candidate, token, setCandidate } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [accountFirstName, setAccountFirstName] = useState("");
  const [accountLastName, setAccountLastName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      setIsEditing(false);
    } catch (err) {
      setError("Could not update account.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/candidates/${candidate.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Could not update password.");
      }
      setPasswordMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Could not update password.");
    }
  };

  const handleCancel = () => {
    setAccountFirstName(candidate.firstName);
    setAccountLastName(candidate.lastName);
    setAccountEmail(candidate.email);
    setIsEditing(false);
  };

  return (
    <>
      <Breadcrumbs path={["Home", "Account"]} />
      <div className="account-header">
        <h1>Account</h1>
        {!isEditing && (
          <button
            type="button"
            className="account-edit-button"
            onClick={() => setIsEditing(true)}
            data-testid="edit-account-button"
          >
            Edit Account
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="account-view" data-testid="account-view">
          <div className="account-field">
            <span className="account-field-label">First Name</span>
            <span className="account-field-value">{candidate.firstName}</span>
          </div>
          <div className="account-field">
            <span className="account-field-label">Last Name</span>
            <span className="account-field-value">{candidate.lastName}</span>
          </div>
          <div className="account-field">
            <span className="account-field-label">Email</span>
            <span className="account-field-value">{candidate.email}</span>
          </div>
          <div className="account-field">
            <span className="account-field-label">Password</span>
            <span className="account-field-value">••••••••</span>
          </div>
        </div>
      ) : (
        <>
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
            <div className="form-actions">
              <BackButton onClick={handleCancel} />
              <button type="submit" className="form-submit-button" data-testid="save-account-button">
                Save Account
              </button>
            </div>
          </form>

          <section aria-label="Change Password" className="account-password-section">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange} data-testid="password-form">
              <div>
                <label htmlFor="current-password-input">Current Password</label>
                <input
                  id="current-password-input"
                  data-testid="current-password-input"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="new-password-input">New Password</label>
                <input
                  id="new-password-input"
                  data-testid="new-password-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm-new-password-input">Confirm New Password</label>
                <input
                  id="confirm-new-password-input"
                  data-testid="confirm-new-password-input"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="form-submit-button"
                  data-testid="update-password-button"
                >
                  Update Password
                </button>
              </div>
            </form>
            {passwordMessage && <p data-testid="password-message">{passwordMessage}</p>}
            {passwordError && (
              <p role="alert" data-testid="password-error-message">
                {passwordError}
              </p>
            )}
          </section>
        </>
      )}

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