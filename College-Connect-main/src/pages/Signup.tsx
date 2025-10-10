import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  Eye,
  EyeOff,
  Upload,
  X,
  FileText,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [studentIdPreview, setStudentIdPreview] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  const allowedColleges = ["kiet.edu", "abc.edu", "xyz.edu"];

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });

    if (formData.role === "student" && email.includes("@")) {
      const domain = email.split("@")[1].toLowerCase();
      setEmailError(
        !allowedColleges.includes(domain)
          ? "Use a valid college email address"
          : ""
      );
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });

    setPasswordError(
      password.length < 6 ? "Password must be at least 6 characters" : ""
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPG, PNG, and PDF files are allowed");
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("File size must be less than 5MB");
      return;
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentIdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setStudentIdPreview("");
    }
  };

  const removeFile = () => {
    setStudentIdFile(null);
    setStudentIdPreview("");
    setFileError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || passwordError || fileError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (formData.role === "student" && !studentIdFile) {
      toast.error("Please upload your student ID card");
      return;
    }

    try {
      setLoading(true);
      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        studentIdFile
      );

      if (formData.role === "student") {
        toast.success("Account created! Waiting for admin verification.");
      } else {
        toast.success("Account created successfully!");
      }
      navigate("/");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to create account. Please try again."
      );
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full sm:max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Join the college community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute inset-y-0 left-3 my-auto text-gray-400 h-5 w-5" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute inset-y-0 left-3 my-auto text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  className="pl-10 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-3 my-auto text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="pl-10 pr-12 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Create a password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 my-auto text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                I am a...
              </label>
              <div className="relative">
                <GraduationCap className="absolute inset-y-0 left-3 my-auto text-gray-400 h-5 w-5" />
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="pl-10 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                  disabled={loading}
                >
                  <option value="student">Student</option>
                  <option value="senior">Senior</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
            </div>

            {formData.role === "student" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID Card <span className="text-red-500">*</span>
                </label>
                {!studentIdFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400"></Upload>
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG or PDF (Max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                  </label>
                ) : (
                  <div className="relative border-2 border-indigo-500 rounded-xl p-4 bg-indigo-50">
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      disabled={loading}
                    >
                      <X className="w-4 h-4"></X>
                    </button>
                    {studentIdPreview ? (
                      <img
                        src={studentIdPreview}
                        alt="Student ID preivew"
                        className="w-full h-48 object-contain rounded-lg"
                      ></img>
                    ) : (
                      <div className="flex items-center justify-center h-24">
                        <FileText className="w-12 h-12 text-indigo-600" />
                        <span className="ml-2 text-sm text-gray-700 font-medium">
                          {studentIdFile.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {fileError && (<p className="text-red-500 text-sm mt-1">{fileError}</p>)}
                <p className="text-xs text-gray-500 mt-2">⚠️ Your account will be verified by admin within 24-48 hours</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
              disabled={loading || emailError !== "" || passwordError !== "" || fileError!==""}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
