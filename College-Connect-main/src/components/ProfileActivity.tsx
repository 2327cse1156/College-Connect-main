import { useState } from "react";
import { Code, Briefcase } from "lucide-react";
import { ProfileForm } from "../pages/Profile";

interface Activity {
  title: string;
  description: string;
  type?: "code" | "work"; // optional type for icon or categorization
}

interface ProfileActivityProps {
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  isEditing: boolean;
}

const ProfileActivity = ({ form, setForm, isEditing }: ProfileActivityProps) => {
  const [newActivity, setNewActivity] = useState<Activity>({ title: "", description: "" });

  const addActivity = () => {
    if (newActivity.title.trim()) {
      setForm({
        ...form,
        activities: [...(form.activities || []), { ...newActivity, type: "code" }],
      });
      setNewActivity({ title: "", description: "" });
    }
  };

  const removeActivity = (index: number) => {
    setForm({
      ...form,
      activities: (form.activities || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

      <div className="space-y-4">
        {(form.activities || []).map((act, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {act.type === "work" ? (
                <Briefcase className="w-5 h-5 text-indigo-600 mt-1" />
              ) : (
                <Code className="w-5 h-5 text-indigo-600 mt-1" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{act.title}</p>
              <p className="text-gray-600 text-sm">{act.description}</p>
            </div>
            {isEditing && (
              <button
                onClick={() => removeActivity(i)}
                className="text-red-500 text-sm ml-auto"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              placeholder="Activity Title"
              value={newActivity.title}
              onChange={(e) =>
                setNewActivity({ ...newActivity, title: e.target.value })
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Activity Description"
              value={newActivity.description}
              onChange={(e) =>
                setNewActivity({ ...newActivity, description: e.target.value })
              }
              className="border px-2 py-1 rounded"
            />
            <button
              onClick={addActivity}
              className="bg-indigo-600 text-white px-3 py-1 rounded mt-1"
            >
              Add Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileActivity;
