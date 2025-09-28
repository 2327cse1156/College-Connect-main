import { useState } from "react";
import { Code, Briefcase, Award, Plus, Trash2 } from "lucide-react";
import { ProfileForm } from "../pages/Profile";

interface Activity {
  title: string;
  description: string;
  type?: "code" | "work" | "achievement";
}

interface ProfileActivityProps {
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  isEditing: boolean;
}

const ProfileActivity = ({ form, setForm, isEditing }: ProfileActivityProps) => {
  const [newActivity, setNewActivity] = useState<Activity>({
    title: "",
    description: "",
    type: "code",
  });

  const addActivity = () => {
    if (newActivity.title.trim()) {
      setForm({
        ...form,
        activities: [...(form.activities || []), newActivity],
      });
      setNewActivity({ title: "", description: "", type: "code" });
    }
  };

  const removeActivity = (index: number) => {
    setForm({
      ...form,
      activities: (form.activities || []).filter((_, i) => i !== index),
    });
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case "work":
        return <Briefcase className="w-4 h-4 text-green-600" />;
      case "achievement":
        return <Award className="w-4 h-4 text-yellow-600" />;
      default:
        return <Code className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Recent Activity</h2>

      {/* Timeline */}
     <div className="relative space-y-6">
  {(form.activities || []).map((act, i) => (
    <div key={i} className="flex items-start gap-4 group">
      {/* Icon Column */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border border-gray-300">
          {getIcon(act.type)}
        </div>
      </div>

      {/* Content Column */}
      <div className="flex-1">
        <p className="font-medium text-gray-900">{act.title}</p>
        <p className="text-gray-600 text-sm">{act.description}</p>
      </div>

      {/* Remove Button */}
      {isEditing && (
        <button
          onClick={() => removeActivity(i)}
          className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-600"
          title="Remove Activity"
          aria-label="Remove Activity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  ))}
</div>


      {/* Add Activity Form */}
      {isEditing && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-3">
          <input
            type="text"
            placeholder="Activity Title"
            value={newActivity.title}
            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
            className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <textarea
            placeholder="Activity Description"
            value={newActivity.description}
            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
            rows={2}
            className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <select
            value={newActivity.type}
            onChange={(e) =>
              setNewActivity({ ...newActivity, type: e.target.value as Activity["type"] })
            }
            className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            aria-label="Activity Type"
          >
            <option value="code">Code</option>
            <option value="work">Work</option>
            <option value="achievement">Achievement</option>
          </select>
          <button
            onClick={addActivity}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileActivity;
