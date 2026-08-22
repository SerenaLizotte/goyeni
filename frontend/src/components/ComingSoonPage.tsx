import { useNavigate } from "react-router";
import Breadcrumbs from "./Breadcrumbs";
import BackButton from "./BackButton";
import "./ComingSoonPage.css";

interface ComingSoonPageProps {
  title: string;
}

function ComingSoonPage({ title }: ComingSoonPageProps) {
  const navigate = useNavigate();

  return (
    <>
      <Breadcrumbs path={["Home", title]} />
      <div className="coming-soon">
        <h1 className="coming-soon-title">{title}</h1>
        <p className="coming-soon-message">Coming soon.</p>
        <BackButton onClick={() => navigate("/")} />
      </div>
    </>
  );
}

export default ComingSoonPage;