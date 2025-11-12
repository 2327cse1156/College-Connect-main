// src/App.tsx - COMPLETE WORKING VERSION
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { Outlet } from "react-router-dom";

// Import components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Import admin layout
import AdminLayout from "./components/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import Hackathons from "./pages/Hackathons";
import TeamBuilder from "./pages/TeamBuilder";
import Resources from "./pages/Resources";
import Alumni from "./pages/Alumni";
import Seniors from "./pages/Seniors";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Protected Pages
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import ChatWindow from "./pages/ChatWindow";

// Admin Pages
import AdminDashboard from "./components/AdminDashboard";
import ManageHackathons from "./pages/ManageHackathons";
import AllUsers from "./pages/AllUsers";
import Analytics from "./pages/Analytics";

// MainLayout Component (Inline - no separate file needed)
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          {/* PUBLIC ROUTES - WITH NAVBAR/FOOTER */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/team-builder" element={<TeamBuilder />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/seniors" element={<Seniors />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected User Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId" // 🆕 ADD THIS - Dynamic route
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:conversationId"
              element={
                <ProtectedRoute>
                  <ChatWindow />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ADMIN ROUTES - WITH SIDEBAR (NO NAVBAR) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="hackathons" element={<ManageHackathons />} />
            <Route path="users" element={<AllUsers />} />
            <Route path="analytics" element={<Analytics/>}/>
          </Route>
        </Routes>

        <Toaster position="top-right" />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
