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
    if (currentUser && !form.name) {
      setForm((prev) => ({
        ...prev,
        name: currentUser.name || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        skills: Array.isArray(currentUser.skills)
          ? currentUser.skills
          : currentUser.skills
          ? [currentUser.skills]
          : [],
        avatar: currentUser.avatar || "",
        resumeUrl: currentUser.resumeUrl || "",
        yearOfAdmission: currentUser.yearOfAdmission || "",
        yearOfGraduation: currentUser.yearOfGraduation || "",
        course: currentUser.course || "",
        branch: currentUser.branch || "",
        college: currentUser.college || "",
        website: currentUser.website || "",
        linkedin: currentUser.linkedin || "",
        github: currentUser.github || "",
        activities: Array.isArray(currentUser.activities)
        ? currentUser.activities
        : [],
      }));
    } else {
      getProfile();
    }
  }, [currentUser]);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

   Object.entries(form).forEach(([key, value]) => {
  if ((key === "avatarFile" || key === "resumeFile") && value instanceof File) {
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
  ...updatedProfile,
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
      <p className="text-center mt-12 text-gray-600">Loading Profile...</p>
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
      <ProfileActivity
  form={form}
  setForm={setForm}
  isEditing={isEditing}
/>

    </div>
  );
};

export default Profile;
