import { Navigate, Link } from "react-router";
import { useAuth } from "../AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import "./DashboardRoute.css";

const MOCK_JOBS = [
  { id: "1", title: "Frontend Engineer", company: "Northbound Labs", location: "Remote" },
  { id: "2", title: "QA Lead", company: "Fernwood Health", location: "Kalispell, MT" },
  { id: "3", title: "Product Designer", company: "Trailmark", location: "Remote" },
];

function DashboardRoute() {
  const { candidate } = useAuth();

  if (!candidate) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Breadcrumbs path={["Home", "Dashboard"]} />
      <h1>Welcome back, {candidate.firstName}</h1>

      <div className="dashboard-shortcuts">
        <span className="dashboard-shortcut dashboard-shortcut--disabled">
          My Applications <em>Coming soon</em>
        </span>
        <span className="dashboard-shortcut dashboard-shortcut--disabled">
          Messages <em>Coming soon</em>
        </span>
        <Link to="/profile" className="dashboard-shortcut">
          Edit Profile
        </Link>
      </div>

      <section aria-label="Job Search">
        <h2>Open Roles</h2>
        <div className="job-list">
          {MOCK_JOBS.map((job) => (
            <div className="job-card" key={job.id}>
              <span className="job-card-title">{job.title}</span>
              <span className="job-card-company">{job.company}</span>
              <span className="job-card-location">{job.location}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default DashboardRoute;