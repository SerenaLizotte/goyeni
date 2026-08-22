import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import LandingRoute from "./pages/LandingRoute";
import LoginRoute from "./pages/LoginRoute";
import ProfileRoute from "./pages/ProfileRoute";
//import RecruiterRoute from "./pages/RecruiterRoute";
import ComingSoonPage from "./components/ComingSoonPage";
import AccountRoute from "./pages/AccountRoute";
import DashboardRoute from "./pages/DashboardRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingRoute /> },
      { path: "login", element: <LoginRoute /> },
      { path: "profile", element: <ProfileRoute /> },
      { path: "recruiter", element: <ComingSoonPage title="Recruiter" /> },
      { path: "about", element: <ComingSoonPage title="About" /> },
      { path: "contact", element: <ComingSoonPage title="Contact" /> },
      { path: "account", element: <AccountRoute /> },
      { path: "dashboard", element: <DashboardRoute /> },
    ],
  },
]);

export default router;