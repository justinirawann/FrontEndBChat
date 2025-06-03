// AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import RegisterPage from "./Pages/RegisterPage";
import UserLayout from "./layouts/UserLayout";
import ChattingPage from "./Pages/ChattingPage";
import MessagePage from './Pages/MessagePage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
  
      

      {/* Nested Route di bawah UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/home" element={<HomePage />} />
        
        <Route path="/messages" element={<MessagePage />} />
        <Route path="/messages/:matchedUserId" element={<ChattingPage />} />

      </Route>
    </Routes>
  );
}
