import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import BackButton from "../components/BackButton";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function ProfileRoute() {
  const navigate = useNavigate();
  const { candidate, token, setCandidate } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profileHeadline, setProfileHeadline] = useState("");
  const [profileSummary, setProfileSummary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (candidate) {
      setProfileFirstName(candidate.firstName);
      setProfileLastName(candidate.lastName);
      setProfileHeadline(candidate.headline || "");
      setProfileSummary(candidate.summary || "");
    }
  }, [candidate]);

  if (!candidate) {
    return <Navigate to="/" replace />;
  }

  const handleProfileSave = async (e: React.FormEvent) => {
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
          email: candidate.email,
          firstName: profileFirstName,
          lastName: profileLastName,
          headline: profileHeadline,
          summary: profileSummary,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setCandidate(updated);
      setSaveMessage("Profile saved.");
      setIsEditing(false);
    } catch (err) {
      setError("Could not save profile.");
    }
  };

  const handleCancel = () => {
    setProfileFirstName(candidate.firstName);
    setProfileLastName(candidate.lastName);
    setProfileHeadline(candidate.headline || "");
    setProfileSummary(candidate.summary || "");
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <Breadcrumbs path={["Home", "My Profile"]} />
      <div className="account-header">
        <h1>My Profile</h1>
        {!isEditing && (
          <button
            type="button"
            className="account-edit-button"
            onClick={() => setIsEditing(true)}
            data-testid="edit-profile-button"
          >
            Edit Profile
          </button>
        )}
      </div>
      <p data-testid="welcome-message">
        Logged in as <span data-testid="profile-email">{candidate.email}</span>
      </p>

      {!isEditing ? (
        <div className="account-view" data-testid="profile-view">
          <div className="account-field">
            <span className="account-field-label">First Name</span>
            <span className="account-field-value">{candidate.firstName}</span>
          </div>
          <div className="account-field">
            <span className="account-field-label">Last Name</span>
            <span className="account-field-value">{candidate.lastName}</span>
          </div>
          <div className="account-field">
            <span className="account-field-label">Headline</span>
            <span className="account-field-value">{candidate.headline || "—"}</span>
          </div>
          <div className="account-field">
            <span className="account-field-label">Summary</span>
            <span className="account-field-value">{candidate.summary || "—"}</span>
          </div>
          <div className="form-actions">
            <BackButton onClick={handleBack} />
          </div>
        </div>
      ) : (
        <form onSubmit={handleProfileSave} data-testid="profile-form">
          <div>
            <label htmlFor="profile-firstname-input">First Name</label>
            <input
              id="profile-firstname-input"
              data-testid="profile-firstname-input"
              type="text"
              value={profileFirstName}
              onChange={(e) => setProfileFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="profile-lastname-input">Last Name</label>
            <input
              id="profile-lastname-input"
              data-testid="profile-lastname-input"
              type="text"
              value={profileLastName}
              onChange={(e) => setProfileLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="profile-headline-input">Headline</label>
            <input
              id="profile-headline-input"
              data-testid="profile-headline-input"
              type="text"
              value={profileHeadline}
              onChange={(e) => setProfileHeadline(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="profile-summary-input">Summary</label>
            <textarea
              id="profile-summary-input"
              data-testid="profile-summary-input"
              value={profileSummary}
              onChange={(e) => setProfileSummary(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <BackButton onClick={handleCancel} />
            <button type="submit" className="form-submit-button" data-testid="save-profile-button">
              Save Profile
            </button>
          </div>
        </form>
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

export default ProfileRoute;