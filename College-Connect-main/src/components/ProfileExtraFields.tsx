import { Dispatch, SetStateAction } from "react";
import { ProfileForm } from "../pages/Profile";
import {
  Calendar,
  Book,
  University,
  Link,
  Github,
  Linkedin,
} from "lucide-react";

interface ProfileExtraFieldsProps {
  form: ProfileForm;
  setForm: Dispatch<SetStateAction<ProfileForm>>;
  isEditing: boolean;
}

const fieldConfigs: {
  key: keyof ProfileForm;
  label: string;
  icon?: JSX.Element;
}[] = [
  {
    key: "yearOfAdmission",
    label: "Year of Admission",
    icon: <Calendar className="w-4 h-4 text-indigo-500" />,
  },
  {
    key: "yearOfGraduation",
    label: "Year of Graduation",
    icon: <Calendar className="w-4 h-4 text-indigo-500" />,
  },
  {
    key: "course",
    label: "Course",
    icon: <Book className="w-4 h-4 text-indigo-500" />,
  },
  {
    key: "branch",
    label: "Branch",
    icon: <Book className="w-4 h-4 text-indigo-500" />,
  },
  {
    key: "college",
    label: "College",
    icon: <University className="w-4 h-4 text-indigo-500" />,
  },
  {
    key: "website",
    label: "Website",
    icon: <Link className="w-4 h-4 text-indigo-500" />,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: <Linkedin className="w-4 h-4 text-indigo-500" />,
  },
  {
    key: "github",
    label: "GitHub",
    icon: <Github className="w-4 h-4 text-indigo-500" />,
  },
];

const ProfileExtraFields = ({
  form,
  setForm,
  isEditing,
}: ProfileExtraFieldsProps) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {fieldConfigs.map(({ key, label, icon }) => (
        <div key={key} className="flex flex-col">
          <label className="font-semibold flex items-center gap-2 mb-1">
            {icon} {label}
          </label>
          {isEditing ? (
            <input
              type="text"
              value={
                form[key] == null
                  ? ""
                  : typeof form[key] === "string"
                  ? form[key]
                  : Array.isArray(form[key])
                  ? (form[key] as string[]).join(", ")
                  : form[key] instanceof File
                  ? form[key].name
                  : String(form[key])
              }
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={`Enter ${label}`}
              className="border rounded px-2 py-1 w-full focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          ) : (
            <p className="text-gray-600 break-all max-w-full overflow-hidden">
              {typeof form[key] === "string"
                ? form[key] || "Not set"
                : Array.isArray(form[key])
                ? (form[key] as string[]).join(", ") || "Not set"
                : form[key] instanceof File
                ? form[key].name
                : "Not set"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProfileExtraFields;
