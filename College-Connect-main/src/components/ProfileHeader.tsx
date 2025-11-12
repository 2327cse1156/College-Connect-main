import { Dispatch, SetStateAction } from "react";
import { Calendar1Icon, Edit3, MapPin } from "lucide-react";
import { ProfileForm } from "../pages/Profile";
interface ProfileHeaderProps {
  form: ProfileForm;
  setForm: Dispatch<SetStateAction<ProfileForm>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  handleSubmit: () => Promise<void>;
  currentUser: any;
  isOwnProfile?:boolean;
}

const ProfileHeader = ({
  form,
  setForm,
  isEditing,
  setIsEditing,
  loading,
  handleSubmit,
  currentUser,
  isOwnProfile=true,
}: ProfileHeaderProps) => {
  const formatMemberSince = () => {
    const dateString = currentUser?.createdAt || currentUser?.updatedAt;
    if (!dateString) {
      console.warn(
        "⚠️ No createdAt or updatedAt found for user:",
        currentUser?._id
      );
      return "Recently joined";
    }

    try {
      const date = new Date(dateString);

      // Check if valid date
     if (isNaN(date.getTime())) {
        console.error("❌ Invalid date string:", dateString);
        return "Recently joined";
      }
      const now = new Date();
      const year2020 = new Date('2020-01-01');
      
      if (date < year2020) {
        console.warn("⚠️ Date too old, using default");
        return "Long-time member";
      }
      
      if (date > now) {
        console.warn("⚠️ Date in future, using default");
        return "Recently joined";
      }

      // Format options
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
      };

      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Recently";
    }
  };
  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "senior":
        return "bg-purple-100 text-purple-800";
      case "alumni":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
      {/* Avatar */}
      <div className="relative group">
        <img
          src={
            form.avatar ||
            `https://ui-avatars.com/api/?name=${currentUser.name}`
          }
          alt="avatar"
          className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-2 border-indigo-500"
        />
        {isEditing && (
          <label
            className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition"
            aria-label="Change avatar"
          >
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                setForm({
                  ...form,
                  avatarFile: e.target.files?.[0] || null,
                  avatar: e.target.files?.[0]
                    ? URL.createObjectURL(e.target.files[0])
                    : form.avatar,
                })
              }
              accept="image/*"
            />
            <Edit3 className="text-white w-5 h-5" />
          </label>
        )}
      </div>

      {/* Name, Role, Location */}
      <div className="flex-1 text-center md:text-left space-y-2">
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded px-3 py-2 text-xl font-semibold w-full"
            placeholder="Full Name"
          />
        ) : (
          <h1 className="text-3xl md:text-4xl font-bold">{currentUser.name}</h1>
        )}

        <div className="flex items-center justify-center md:justify-start gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(
              currentUser?.role
            )}`}
          >
            {currentUser?.role?.charAt(0).toUpperCase() +
              currentUser?.role?.slice(1) || "Student"}
          </span>

          {(currentUser?.role === "student" ||
            currentUser?.role === "senior") &&
            currentUser?.currentYear && (
              <span className="text-sm text-gray-600">
                • {currentUser.currentYear}
                {currentUser.currentYear === 1
                  ? "st"
                  : currentUser.currentYear === 2
                  ? "nd"
                  : currentUser.currentYear === 3
                  ? "rd"
                  : "th"}{" "}
                Year
              </span>
            )}
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-gray-500 text-sm">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-500" />
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="border rounded px-2 py-1 text-sm w-32 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="Location"
              ></input>
            ) : (
              <span>{form.location || "Not set"}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar1Icon className="w-4 h-4 text-indigo-500" />

            <span title={currentUser?.createdAt ? new Date(currentUser.createdAt).toISOString():"No date available"}>
              Member since {formatMemberSince()}
            </span>
          </div>
        </div>
        {(currentUser?.role === "student" || currentUser?.role === "senior") &&
          (currentUser?.admissioFnYear || currentUser?.graduationYear) && (
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-gray-500 mt-2">
              {currentUser.admissionYear && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  📚Admitted: {currentUser.admissionYear}
                </span>
              )}
              {currentUser.graduationYear && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  🎓 Graduating: {currentUser.graduationYear}
                </span>
              )}
            </div>
          )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 md:mt-0">
        {isOwnProfile ? (isEditing ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-5 py-2 rounded-lg transition font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white"
              } hover:bg-green-700`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="px-5 py-2 bg-gray-400 text-white rounded font-semibold hover:bg-gray-500 transition disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        )):(<div className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold">
          View Only
        </div>)}
      </div>
    </div>
  );
};

export default ProfileHeader;
