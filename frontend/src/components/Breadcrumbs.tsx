import { Link } from "react-router";
import "./Breadcrumbs.css";

interface BreadcrumbsProps {
  path: string[];
}

function Breadcrumbs({ path }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb" data-testid="breadcrumbs">
      {path.map((segment, index) => (
        <span key={index} className="breadcrumb-segment">
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          {index === 0 ? (
            <Link to="/" className="breadcrumb-link">
              {segment}
            </Link>
          ) : (
            segment
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;