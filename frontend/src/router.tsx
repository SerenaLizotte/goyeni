import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import LandingRoute from "./pages/LandingRoute";
import LoginRoute from "./pages/LoginRoute";
import ProfileRoute from "./pages/ProfileRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingRoute /> },
      { path: "login", element: <LoginRoute /> },
      { path: "profile", element: <ProfileRoute /> },
    ],
  },
]);

export default router;