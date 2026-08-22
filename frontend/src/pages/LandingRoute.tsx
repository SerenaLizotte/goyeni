import { useNavigate } from "react-router";
import LandingPage from "../components/LandingPage";

function LandingRoute() {
  const navigate = useNavigate();

  return (
    <LandingPage
      onSelectCandidate={() => navigate("/login")}
      onSelectRecruiter={() => navigate("/recruiter")}
    />
  );
}

export default LandingRoute;