import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
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
  isAdmin?:boolean;
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

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL + "/auth";
  const PROFILE_URL = import.meta.env.VITE_API_URL + "/profile";

  useEffect(() => {
    getProfile().catch(() => setCurrentUser(null));
  }, []);

  // ✅ Signup
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

      if (studentIdFile) {
        formData.append("studentId", studentIdFile);
      }

      const res = await axios.post(`${API_URL}/signup`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (
        res.data.user.role === "student" &&
        res.data.user.verificationStatus === "pending"
      ) {
        toast.success(
          "✅ Account created! Please wait for admin verification.",
          { duration: 5000 }
        );
        setCurrentUser(null);
        return;
      }

      setCurrentUser(res.data.user);
      toast.success("🎉 Account created successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      setCurrentUser(res.data.user);
      toast.success("Logged in successfully!");
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.verificationStatus === "pending") {
        toast.error(
          "⏳ Your account is pending verification. Please wait for admin approval.",
          { duration: 5000 }
        );
      } else if (errorData?.verificationStatus === "rejected") {
        toast.error(
          `❌ Account rejected: ${
            errorData.rejectionReason || "Contact admin for details"
          }`,
          { duration: 6000 }
        );
      }
      else{
        toast.error(errorData?.error || "Login failed");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setCurrentUser(null);
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Logout failed");
    }
  };

  // ✅ Get Profile
  const getProfile = async (): Promise<User | null> => {
    try {
      const res = await axios.get(PROFILE_URL, { withCredentials: true });
      setCurrentUser(res.data.user);
      return res.data.user;
    } catch {
      setCurrentUser(null);
      return null;
    }
  };

  // ✅ Update Profile (Cloudinary avatar + new fields)
  const updateProfile = async (data: FormData): Promise<User> => {
    try {
      const res = await axios.put(PROFILE_URL, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCurrentUser(res.data.user);
      toast.success("Profile updated!");
      return res.data.user;
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Profile update failed");
      throw err;
    }
  };

  // ✅ Forgot Password
  const forgotPassword = async (email: string) => {
    try {
      await axios.post(
        `${API_URL}/forgot-password`,
        { email },
        { withCredentials: true }
      );
      toast.success("Reset link sent! Check your email.");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send reset email");
      throw err;
    }
  };

  // ✅ Reset Password
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await axios.post(
        `${API_URL}/reset-password`,
        { token, newPassword },
        { withCredentials: true }
      );
      toast.success("Password reset successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to reset password");
      throw err;
    }
  };

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
