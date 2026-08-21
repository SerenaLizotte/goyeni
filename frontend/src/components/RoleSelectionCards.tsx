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
      <div className="role-column">
        <button
          className="role-card role-card--candidate"
          onClick={onSelectCandidate}
          data-testid="job-seeker-card"
        >
          <span className="role-card-label">I'm a Job Seeker</span>
          <span className="role-card-action">Explore Verified Roles &rarr;</span>
        </button>
        <div className="role-connector role-connector--candidate" />
        <a
        
          href="#"
          className="feature-box feature-box--candidate"
          data-testid="candidate-feature-link"
        >
          <span className="feature-box-title">No Automated Rejects</span>
          <span className="feature-box-desc">
            Direct application to hiring managers.
          </span>
        </a>
      </div>

      <div className="role-column">
        <button
          className="role-card role-card--recruiter"
          onClick={onSelectRecruiter}
          data-testid="recruiter-card"
        >
          <span className="role-card-label">I'm a Recruiter</span>
          <span className="role-card-action">Find Verified Talent &rarr;</span>
        </button>
        <div className="role-connector role-connector--recruiter" />
        <a
        
          href="#"
          className="feature-box feature-box--recruiter"
          data-testid="recruiter-feature-link"
        >
          <span className="feature-box-title">Direct Contact</span>
          <span className="feature-box-desc">
            Build real relationships with real human connection.
          </span>
        </a>
      </div>
    </div>
  );
}

export default RoleSelectionCards;
