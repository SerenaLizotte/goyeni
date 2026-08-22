import "./TrustBar.css";

const BADGES = ["0% AI Screening", "100% Human Driven", "Real People, Real Results"];

function TrustBar() {
  return (
    <div className="trust-bar">
      <p className="trust-bar-title">The Anti-Algorithm Promise</p>
      <div className="trust-bar-badges">
        {BADGES.map((label) => (
          <span className="trust-badge" key={label}>
            {label}
            <span className="trust-badge-tooltip">Text coming soon</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default TrustBar;