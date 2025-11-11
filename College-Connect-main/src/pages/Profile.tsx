import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

import ProfileHeader from "../components/ProfileHeader";
import ProfileBio from "../components/ProfileBio";
import ProfileSkills from "../components/ProfileSkills";
import ProfileResume from "../components/ProfileResume";
import ProfileActivity from "../components/ProfileActivity";
import ProfileExtraFields from "../components/ProfileExtraFields";

export interface ProfileForm {
  name: string;
  bio: string;
  location: string;
  skills: string[];
  avatarFile: File | null;
  avatar: string;
  resumeFile: File | null;
  resumeUrl: string;
  yearOfAdmission: string;
  yearOfGraduation: string;
  course: string;
  branch: string;
  college: string;
  website: string;
  linkedin: string;
  github: string;
  activities?: { title: string; description: string; type?: string }[];
}

const Profile = () => {
  const { currentUser, updateProfile, getProfile } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    bio: "",
    location: "",
    skills: [],
    avatarFile: null,
    avatar: "",
    resumeFile: null,
    resumeUrl: "",
    yearOfAdmission: "",
    yearOfGraduation: "",
    course: "",
    branch: "",
    college: "",
    website: "",
    linkedin: "",
    github: "",
    activities: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      console.log("Loading profile...");

      const freshProfile = await getProfile();

      console.log("Fresh profile fetched:", freshProfile);

      if (freshProfile) {
        // Agar currentUser already hai to directly form populate karo
        setForm({
          name: freshProfile.name || "",
          bio: freshProfile.bio || "",
          location: freshProfile.location || "",
          skills: Array.isArray(freshProfile.skills) ? freshProfile.skills : [],
          avatarFile: null,
          avatar: freshProfile.avatar || "",
          resumeFile: null,
          resumeUrl: freshProfile.resumeUrl || "",
          yearOfAdmission: freshProfile.admissionYear?.toString() || "",
          yearOfGraduation: freshProfile.graduationYear?.toString() || "",
          course: freshProfile.course || "",
          branch: freshProfile.branch || "",
          college: freshProfile.college || "",
          website: freshProfile.website || "",
          linkedin: freshProfile.linkedin || "",
          github: freshProfile.github || "",
          activities: Array.isArray(freshProfile.activities)
            ? freshProfile.activities
            : [],
        });
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (
          (key === "avatarFile" || key === "resumeFile") &&
          value instanceof File
        ) {
          formData.append(key === "avatarFile" ? "avatar" : "resume", value);
        } else if (key === "skills" || key === "activities") {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });

      // Send formData to backend
      const updatedProfile = await updateProfile(formData);
      setForm((prev) => ({
        ...prev,
        name: updatedProfile.name || prev.name,
        bio: updatedProfile.bio || prev.bio,
        location: updatedProfile.location || prev.location,
        skills: updatedProfile.skills || prev.skills,
        avatar: updatedProfile.avatar || prev.avatar,
        resumeUrl: updatedProfile.resumeUrl || prev.resumeUrl,
        yearOfAdmission:
          updatedProfile.admissionYear?.toString() || prev.yearOfAdmission,
        yearOfGraduation:
          updatedProfile.graduationYear?.toString() || prev.yearOfGraduation,
        course: updatedProfile.course || prev.course,
        branch: updatedProfile.branch || prev.branch,
        college: updatedProfile.college || prev.college,
        website: updatedProfile.website || prev.website,
        linkedin: updatedProfile.linkedin || prev.linkedin,
        github: updatedProfile.github || prev.github,
        activities: updatedProfile.activities || prev.activities,
        avatarFile: null,
        resumeFile: null,
      }));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Profile...</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <ProfileHeader
        form={form}
        setForm={setForm}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        loading={loading}
        handleSubmit={handleSubmit}
        currentUser={currentUser}
      />

      {/* Bio + Extra Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileBio form={form} setForm={setForm} isEditing={isEditing} />
          <ProfileSkills form={form} setForm={setForm} isEditing={isEditing} />
          <ProfileResume form={form} setForm={setForm} isEditing={isEditing} />
        </div>

        <ProfileExtraFields
          form={form}
          setForm={setForm}
          isEditing={isEditing}
        />
      </div>

      {/* Recent Activity */}
      <ProfileActivity form={form} setForm={setForm} isEditing={isEditing} />
    </div>
  );
};

export default Profile;
