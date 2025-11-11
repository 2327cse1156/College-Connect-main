import { ProfileForm } from "../pages/Profile";
import { ChangeEvent } from "react";

interface Props {
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  isEditing: boolean;
}

const ProfileBio = ({ form, setForm, isEditing }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-2">About Me</h2>
      {isEditing ? (
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="border rounded w-full px-2 py-1"
          aria-label="Bio"
        />
      ) : (
        <p className="text-gray-600">{form.bio || "No bio added yet."}</p>
      )}
    </div>
  );
};

export default ProfileBio;
