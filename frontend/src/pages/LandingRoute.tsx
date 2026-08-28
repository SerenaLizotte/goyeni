import { useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import LandingPage from "../components/LandingPage";

function LandingRoute() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <LandingPage
      onSelectCandidate={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
      onSelectRecruiter={() => navigate("/recruiter")}
    />
  );
}

export default LandingRoute;