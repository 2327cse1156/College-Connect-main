// import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Hackathons from "./pages/Hackathons.tsx";
import TeamBuilder from "./pages/TeamBuilder";
import Resources from "./pages/Resources";
import Alumni from "./pages/Alumni";
import Seniors from "./pages/Seniors";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/team-builder" element={<TeamBuilder />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/seniors" element={<Seniors />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
