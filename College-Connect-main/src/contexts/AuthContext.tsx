import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface AuthContextType {
  currentUser: any;
  loading: boolean;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:3000/api/auth"; // Backend URL

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password,
        role,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setCurrentUser(user);
      toast.success("Account created successfully!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Signup failed";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setCurrentUser(user);
      toast.success("Logged in successfully!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Login failed";
      toast.error(errorMessage);
      console.error("Login failed:", errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      toast.success("Reset link sent! Check your email.");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Failed to send reset email";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await axios.post(`${API_URL}/reset-password`, { token, newPassword });
      toast.success("Password reset successfully!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Failed to reset password";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = { currentUser, loading, signup, login,forgotPassword,resetPassword };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
