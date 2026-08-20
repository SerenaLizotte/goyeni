import "./TrustBar.css";

function TrustBar() {
  return (
    <div className="trust-bar">
      <p className="trust-bar-title">The Anti-Algorithm Promise</p>
      <div className="trust-bar-badges">
        <span className="trust-badge">0% AI Screening</span>
        <span className="trust-badge">100% Human Review</span>
        <span className="trust-badge">Direct Contact with Teams</span>
      </div>
    </div>
  );
}

export default TrustBar;