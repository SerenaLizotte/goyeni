import LandingNav from "./LandingNav";
import LandingHero from "./LandingHero";
import RoleSelectionCards from "./RoleSelectionCards";
import TrustBar from "./TrustBar";
import "./LandingPage.css";

interface LandingPageProps {
  onSelectCandidate: () => void;
  onSelectRecruiter: () => void;
}

function LandingPage({ onSelectCandidate, onSelectRecruiter }: LandingPageProps) {
  return (
    <div className="landing-page">
      <LandingNav />
      <LandingHero />
      <RoleSelectionCards
        onSelectCandidate={onSelectCandidate}
        onSelectRecruiter={onSelectRecruiter}
      />
      <TrustBar />
    </div>
  );
}

export default LandingPage;