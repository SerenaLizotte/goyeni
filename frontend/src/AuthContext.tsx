import { createContext, useContext, useState, type ReactNode } from "react";

export interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  summary: string | null;
  isActive: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

interface AuthContextValue {
  candidate: Candidate | null;
  isLoggedIn: boolean;
  initials: string;
  login: (email: string, firstName: string, lastName: string) => Promise<Candidate>;
  logout: () => void;
  setCandidate: (candidate: Candidate) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [candidate, setCandidateState] = useState<Candidate | null>(null);

  const login = async (email: string, firstName: string, lastName: string) => {
    const lookupRes = await fetch(
      `${API_BASE}/candidates/lookup?email=${encodeURIComponent(email)}`
    );

    if (lookupRes.ok) {
      const found = await lookupRes.json();
      setCandidateState(found);
      return found;
    }

    if (lookupRes.status === 404) {
      const createRes = await fetch(`${API_BASE}/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName || "New",
          lastName: lastName || "Candidate",
        }),
      });
      if (!createRes.ok) throw new Error("Could not create profile");
      const created = await createRes.json();
      setCandidateState(created);
      return created;
    }

    throw new Error("Login failed");
  };

  const logout = () => {
    setCandidateState(null);
  };

  const setCandidate = (updated: Candidate) => {
    setCandidateState(updated);
  };

  const initials = candidate
    ? `${candidate.firstName[0] || ""}${candidate.lastName[0] || ""}`
    : "";

  return (
    <AuthContext.Provider
      value={{
        candidate,
        isLoggedIn: candidate !== null,
        initials,
        login,
        logout,
        setCandidate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}