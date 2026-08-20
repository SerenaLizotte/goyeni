import { useState } from "react";
import "./App.css";
import NavHeader from "./components/NavHeader";

interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  summary: string | null;
  isActive: boolean;
}

const API_BASE = "http://localhost:4000";

function App() {
  const [loggedInCandidate, setLoggedInCandidate] = useState<Candidate | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginFirstName, setLoginFirstName] = useState("");
  const [loginLastName, setLoginLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profileHeadline, setProfileHeadline] = useState("");
  const [profileSummary, setProfileSummary] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const lookupRes = await fetch(
        `${API_BASE}/candidates/lookup?email=${encodeURIComponent(loginEmail)}`
      );

      if (lookupRes.ok) {
        const candidate = await lookupRes.json();
        loadCandidateIntoProfile(candidate);
        return;
      }

      if (lookupRes.status === 404) {
        const createRes = await fetch(`${API_BASE}/candidates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginEmail,
            firstName: loginFirstName || "New",
            lastName: loginLastName || "Candidate",
          }),
        });
        if (!createRes.ok) throw new Error("Could not create profile");
        const candidate = await createRes.json();
        loadCandidateIntoProfile(candidate);
        return;
      }

      throw new Error("Login failed");
    } catch (err) {
      setError("Could not log in. Is the backend running?");
    }
  };

  const loadCandidateIntoProfile = (candidate: Candidate) => {
    setLoggedInCandidate(candidate);
    setProfileFirstName(candidate.firstName);
    setProfileLastName(candidate.lastName);
    setProfileHeadline(candidate.headline || "");
    setProfileSummary(candidate.summary || "");
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInCandidate) return;
    setError(null);
    setSaveMessage(null);

    try {
      const res = await fetch(`${API_BASE}/candidates/${loggedInCandidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loggedInCandidate.email,
          firstName: profileFirstName,
          lastName: profileLastName,
          headline: profileHeadline,
          summary: profileSummary,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setLoggedInCandidate(updated);
      setSaveMessage("Profile saved.");
    } catch (err) {
      setError("Could not save profile.");
    }
  };

  const handleLogout = () => {
    setLoggedInCandidate(null);
    setLoginEmail("");
    setLoginFirstName("");
    setLoginLastName("");
    setError(null);
    setSaveMessage(null);
  };

  if (!loggedInCandidate) {
    return (
      <div className="app-container">
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
            <button type="submit" data-testid="login-button">
              Log In
            </button>
          </form>
          {error && (
            <p role="alert" data-testid="error-message">
              {error}
            </p>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="app-container">
      <NavHeader initials={`${profileFirstName[0] || ""}${profileLastName[0] || ""}`} />
      <h1>My Profile</h1>
      <p data-testid="welcome-message">
        Logged in as <span data-testid="profile-email">{loggedInCandidate.email}</span>
      </p>
      <button onClick={handleLogout} data-testid="logout-button">
        Log Out
      </button>

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
        <button type="submit" data-testid="save-profile-button">
          Save Profile
        </button>
      </form>

      {saveMessage && <p data-testid="save-message">{saveMessage}</p>}
      {error && (
        <p role="alert" data-testid="error-message">
          {error}
        </p>
      )}
    </div>
  );
}

export default App;
