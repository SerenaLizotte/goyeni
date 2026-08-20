import "./NavHeader.css";

interface NavHeaderProps {
  initials: string;
}

function NavHeader({ initials }: NavHeaderProps) {
  return (
    <div className="nav-header">
      <div className="nav-logo">
        <div className="nav-logo-mark">G</div>
        <span className="nav-logo-text">goyeni</span>
      </div>
      <div className="nav-actions">
        <span className="nav-bell" aria-hidden="true">
          🔔
        </span>
        <div className="nav-avatar" data-testid="nav-avatar">
          {initials}
        </div>
      </div>
    </div>
  );
}

export default NavHeader;