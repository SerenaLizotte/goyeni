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
          {segment}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;