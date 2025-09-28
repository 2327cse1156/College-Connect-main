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
}

const ProfileHeader = ({
  form,
  setForm,
  isEditing,
  setIsEditing,
  loading,
  handleSubmit,
  currentUser,
}: ProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
      {/* Avatar */}
      <div className="relative group">
        <img
          src={form.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}`}
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
                setForm({ ...form, avatarFile: e.target.files?.[0] || null, avatar: e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : form.avatar })
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

        <p className="text-gray-600 text-sm md:text-base">{currentUser.role}</p>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <span className="material-icons text-indigo-500"><MapPin/></span>
            <span>{form.location || "Not set"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-icons text-indigo-500"><Calendar1Icon/></span>
            <span>Member since {new Date(currentUser.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 md:mt-0">
        {isEditing ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-5 py-2 rounded font-semibold ${loading ? "bg-gray-400" : "bg-green-600 text-white"} transition hover:bg-green-700`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="px-5 py-2 bg-gray-400 text-white rounded font-semibold hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
