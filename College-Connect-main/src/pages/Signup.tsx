import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Upload,
  X,
  FileText,
  Calendar,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    admissionYear: new Date().getFullYear().toString(),
    graduationYear: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [studentIdPreview, setStudentIdPreview] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const allowedColleges = ["kiet.edu", "abc.edu", "xyz.edu"];
  
  // Generate year options
  const currentYear = new Date().getFullYear();
  const admissionYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const graduationYears = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: "", color: "" };
    if (password.length < 6) return { strength: "Weak", color: "text-red-500" };
    if (password.length < 10) return { strength: "Medium", color: "text-yellow-500" };
    return { strength: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (email.includes("@")) {
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

    setUploadProgress(true);
    
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "image/jpg",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPG, PNG, and PDF files are allowed");
      setStudentIdFile(null);
      setUploadProgress(false);
      return;
    }
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("File size must be less than 5MB");
      setStudentIdFile(null);
      setUploadProgress(false);
      return;
    }

    setFileError("");
    setStudentIdFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentIdPreview(reader.result as string);
        setUploadProgress(false);
      };
      reader.readAsDataURL(file);
    } else {
      setStudentIdPreview("");
      setUploadProgress(false);
    }
  };

  const removeFile = () => {
    setStudentIdFile(null);
    setStudentIdPreview("");
    setFileError("");
    
    // Fix: File input reset
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError || passwordError || fileError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (!studentIdFile) {
      toast.error("Please upload your student ID card");
      return;
    }

    if (!formData.graduationYear) {
      toast.error("Please select your expected graduation year");
      return;
    }

    try {
      setLoading(true);
      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        studentIdFile,
        formData.admissionYear,
        formData.graduationYear
      );

      toast.success("Account created! Waiting for admin verification.");
      navigate("/");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to create account. Please try again."
      );
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
                <p className="text-red-500 text-sm mt-1" role="alert">{emailError}</p>
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mt-1">
                {passwordError && (
                  <p className="text-red-500 text-sm" role="alert">{passwordError}</p>
                )}
                {!passwordError && passwordStrength.strength && (
                  <p className={`text-sm ${passwordStrength.color}`}>
                    {passwordStrength.strength}
                  </p>
                )}
              </div>
            </div>

            {/* Academic Years */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="admissionYear"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Admission Year
                </label>
                <div className="relative">
                  <Calendar className="absolute inset-y-0 left-3 my-auto text-gray-400 h-5 w-5" />
                  <select
                    id="admissionYear"
                    value={formData.admissionYear}
                    onChange={(e) =>
                      setFormData({ ...formData, admissionYear: e.target.value })
                    }
                    className="pl-10 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    disabled={loading}
                  >
                    {admissionYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="graduationYear"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expected Graduation
                </label>
                <div className="relative">
                  <Calendar className="absolute inset-y-0 left-3 my-auto text-gray-400 h-5 w-5" />
                  <select
                    id="graduationYear"
                    value={formData.graduationYear}
                    onChange={(e) =>
                      setFormData({ ...formData, graduationYear: e.target.value })
                    }
                    className="pl-10 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    disabled={loading}
                  >
                    <option value="">Select Year</option>
                    {graduationYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>📚 Students Only:</strong> Currently accepting student
                registrations. Your role will be automatically updated as you
                progress through your academic journey.
              </p>
            </div>

            {/* Student ID Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID Card <span className="text-red-500">*</span>
              </label>
              {!studentIdFile ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
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
                    aria-label="Upload student ID card"
                  />
                </label>
              ) : (
                <div className="relative border-2 border-indigo-500 rounded-xl p-4 bg-indigo-50">
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    disabled={loading}
                    title="Remove file"
                    aria-label="Remove uploaded file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {uploadProgress ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : studentIdPreview ? (
                    <img
                      src={studentIdPreview}
                      alt="Student ID preview"
                      className="w-full h-48 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-24">
                      <FileText className="w-12 h-12 text-indigo-600" />
                      <span className="ml-2 text-sm text-gray-700 font-medium">
                        {studentIdFile.name}
                      </span>
                    </div>
                  )}
                  <p className="text-center text-xs text-green-600 font-medium mt-2">
                    ✓ File uploaded successfully
                  </p>
                </div>
              )}
              {fileError && (
                <p className="text-red-500 text-sm mt-1" role="alert">{fileError}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ Your account will be verified by admin within 24-48 hours
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                loading ||
                emailError !== "" ||
                passwordError !== "" ||
                fileError !== ""
              }
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