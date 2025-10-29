import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// ---------------------------
// Types
// ---------------------------
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  skills?: string[];
  avatar?: string;
  location?: string;
  yearOfAdmission?: string;
  yearOfGraduation?: string;
  course?: string;
  branch?: string;
  createdAt?: string;
  updatedAt?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  resumeUrl?: string;
  college?: string;
  activities?: { title: string; description: string; type?: string }[];
  verificationStatus?: "pending" | "approved" | "rejected";
  studentIdUrl?: string;
  rejectionReason?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string,
    studentIdFile?: File | null
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<User | null>;
  updateProfile: (data: FormData) => Promise<User>;
}

// ---------------------------
// Context Setup
// ---------------------------
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("❌ useAuth must be used within an AuthProvider");
  return context;
};

// ---------------------------
// Provider Component
// ---------------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;
  const AUTH_URL = `${API_BASE}/auth`;
  const PROFILE_URL = `${API_BASE}/profile`;

  // Auto-fetch user profile on mount
  useEffect(() => {
    void getProfile();
  }, []);

  // ---------------------------
  // AUTH METHODS
  // ---------------------------

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string,
    studentIdFile?: File | null
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (studentIdFile) formData.append("studentId", studentIdFile);

      const { data } = await axios.post(`${AUTH_URL}/signup`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { user } = data;
      if (user.role === "student" && user.verificationStatus === "pending") {
        toast.success("✅ Account created! Awaiting admin verification.");
        setCurrentUser(null);
      } else {
        setCurrentUser(user);
        toast.success("🎉 Account created successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${AUTH_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      setCurrentUser(data.user);
      toast.success("✅ Logged in successfully!");
    } catch (err: any) {
      const { data } = err.response || {};
      if (data?.verificationStatus === "pending") {
        toast.error("⏳ Account pending admin verification.");
      } else if (data?.verificationStatus === "rejected") {
        toast.error(
          `❌ Account rejected: ${
            data.rejectionReason || "Contact admin for details."
          }`
        );
      } else {
        toast.error(data?.error || "Login failed.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${AUTH_URL}/logout`, {}, { withCredentials: true });
      setCurrentUser(null);
      toast.success("👋 Logged out successfully!");
    } catch {
      toast.error("Logout failed. Try again.");
    }
  };

  const getProfile = async (): Promise<User | null> => {
    try {
      const { data } = await axios.get(PROFILE_URL, { withCredentials: true });
      setCurrentUser(data.user);
      return data.user;
    } catch {
      setCurrentUser(null);
      return null;
    }
  };

  const updateProfile = async (formData: FormData): Promise<User> => {
    try {
      const { data } = await axios.put(PROFILE_URL, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentUser(data.user);
      toast.success("✅ Profile updated successfully!");
      return data.user;
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Profile update failed");
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${AUTH_URL}/forgot-password`, { email });
      toast.success("📧 Reset link sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send reset link");
      throw err;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await axios.post(`${AUTH_URL}/reset-password`, {
        token,
        newPassword,
      });
      toast.success("🔑 Password reset successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Password reset failed");
      throw err;
    }
  };

  // ---------------------------
  // PROVIDER RETURN
  // ---------------------------
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signup,
        login,
        logout,
        getProfile,
        updateProfile,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
