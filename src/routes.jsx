import { Routes, Route } from "react-router-dom";


import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />}/>
    </Routes>
    
  );
}
