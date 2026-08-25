import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<Candidate>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<Candidate>;
  logout: () => void;
  setCandidate: (candidate: Candidate) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [candidate, setCandidateState] = useState<Candidate | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("goyeni_token");
    const storedCandidate = localStorage.getItem("goyeni_candidate");
    if (storedToken && storedCandidate) {
      setToken(storedToken);
      setCandidateState(JSON.parse(storedCandidate));
    }
  }, []);

  const persist = (newToken: string, newCandidate: Candidate) => {
    localStorage.setItem("goyeni_token", newToken);
    localStorage.setItem("goyeni_candidate", JSON.stringify(newCandidate));
    setToken(newToken);
    setCandidateState(newCandidate);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/candidates/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error("Invalid email or password");
    }
    const { candidate: loggedInCandidate, token: newToken } = await res.json();
    persist(newToken, loggedInCandidate);
    return loggedInCandidate;
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const res = await fetch(`${API_BASE}/candidates/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (!res.ok) {
      if (res.status === 409) throw new Error("Email already registered");
      throw new Error("Could not create account");
    }
    const { candidate: newCandidate, token: newToken } = await res.json();
    persist(newToken, newCandidate);
    return newCandidate;
  };

  const logout = () => {
    localStorage.removeItem("goyeni_token");
    localStorage.removeItem("goyeni_candidate");
    setToken(null);
    setCandidateState(null);
  };

  const setCandidate = (updated: Candidate) => {
    localStorage.setItem("goyeni_candidate", JSON.stringify(updated));
    setCandidateState(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        candidate,
        token,
        isLoggedIn: candidate !== null,
        login,
        register,
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