import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import LandingPage from "./Pages/LandingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
