import React, { createContext, useContext, useState} from "react";
import axios from "axios";

interface AuthContextType {
  currentUser: any;
  loading: boolean;
  signup: (name: string, email: string, password: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:3000/api/auth"; // Your backend port

  const signup = async (name: string, email: string, password: string, role: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/signup`, { name, email, password, role });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setCurrentUser(user);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const value = { currentUser, loading, signup };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
