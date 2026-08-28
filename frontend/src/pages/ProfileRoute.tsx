import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import BackButton from "../components/BackButton";
import WorkExperienceSection from "../components/WorkExperienceSection";
import type { EditableExperience } from "../components/WorkExperienceSection";

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

  const [editableExperienceList, setEditableExperienceList] = useState<EditableExperience[]>([]);

  useEffect(() => {
    if (candidate) {
      setProfileFirstName(candidate.firstName);
      setProfileLastName(candidate.lastName);
      setProfileHeadline(candidate.headline || "");
      setProfileSummary(candidate.summary || "");
    }
  }, [candidate]);

  useEffect(() => {
    if (!candidate || !token) return;
    fetch(`${API_BASE}/candidates/${candidate.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((full) => {
        if (full) setCandidate(full);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate?.id]);

  if (!candidate) {
    return <Navigate to="/" replace />;
  }

  const startEditing = () => {
    setEditableExperienceList(
      (candidate.workExperiences || []).map((exp) => ({
        ...exp,
        id: exp.id,
        clientKey: exp.id,
      }))
    );
    setIsEditing(true);
  };

  const saveExperienceEntries = async () => {
    for (const entry of editableExperienceList) {
      if (!entry.title || !entry.employer || !entry.startDate) continue;

      const payload = {
        title: entry.title,
        employer: entry.employer,
        city: entry.city || null,
        state: entry.state || null,
        startDate: entry.startDate,
        endDate: entry.endDate || null,
        description: entry.description || null,
      };

      if (entry.id) {
        await fetch(`${API_BASE}/candidates/${candidate.id}/experience/${entry.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_BASE}/candidates/${candidate.id}/experience`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }
    }

    const freshRes = await fetch(`${API_BASE}/candidates/${candidate.id}`);
    if (!freshRes.ok) throw new Error("Could not refresh candidate");
    const fresh = await freshRes.json();
    setCandidate(fresh);
    setEditableExperienceList(
      (fresh.workExperiences || []).map((exp: any) => ({
        ...exp,
        id: exp.id,
        clientKey: exp.id,
      }))
    );
  };

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

      await saveExperienceEntries();

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
            onClick={startEditing}
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

      <WorkExperienceSection
        experiences={candidate.workExperiences || []}
        isEditing={isEditing}
        candidateId={candidate.id}
        token={token}
        editableList={editableExperienceList}
        onEditableListChange={setEditableExperienceList}
        onSaveExperience={saveExperienceEntries}
      />

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