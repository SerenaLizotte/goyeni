import "./RoleSelectionCards.css";

interface RoleSelectionCardsProps {
  onSelectCandidate: () => void;
  onSelectRecruiter: () => void;
}

function RoleSelectionCards({
  onSelectCandidate,
  onSelectRecruiter,
}: RoleSelectionCardsProps) {
  return (
    <div className="role-cards">
      <button
        className="role-card"
        onClick={onSelectCandidate}
        data-testid="job-seeker-card"
      >
        <span className="role-card-label">I'm a Job Seeker</span>
        <span className="role-card-action">Explore Verified Roles &rarr;</span>
      </button>
      <button
        className="role-card"
        onClick={onSelectRecruiter}
        data-testid="recruiter-card"
      >
        <span className="role-card-label">I'm a Recruiter</span>
        <span className="role-card-action">Find Verified Talent &rarr;</span>
      </button>
    </div>
  );
}

export default RoleSelectionCards;