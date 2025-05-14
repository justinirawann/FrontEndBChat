import { Routes, Route } from "react-router-dom";


import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
