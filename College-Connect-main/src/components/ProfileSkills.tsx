import { X } from "lucide-react";
import { ProfileForm } from "../pages/Profile";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ProfileSkillsProps {
  form: ProfileForm;
  setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
  isEditing: boolean;
}

const SKILL_SUGGESTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Django",
  "MongoDB",
  "SQL",
  "CSS",
  "Tailwind",
];

const ProfileSkills = ({ form, setForm, isEditing }: ProfileSkillsProps) => {
  const [skillsInput, setSkillsInput] = useState("");

  const handleSkillsKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillsInput.trim()) {
      if (!form.skills.includes(skillsInput.trim())) {
        setForm({ ...form, skills: [...form.skills, skillsInput.trim()] });
      }
      setSkillsInput("");
      e.preventDefault();
    }
  };

  const addSuggestedSkill = (skill: string) => {
    if (!form.skills.includes(skill)) setForm({ ...form, skills: [...form.skills, skill] });
  };

  const removeSkill = (index: number) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Skills</h2>

      {/* Skill Tags */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {form.skills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1"
            >
              {skill}
              {isEditing && (
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeSkill(i)}
                />
              )}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Input for new skills */}
        {isEditing && (
          <input
            type="text"
            placeholder="Add skill and press Enter"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            onKeyDown={handleSkillsKey}
            className="border px-2 py-1 rounded min-w-[120px]"
            aria-label="Add new skill"
          />
        )}
      </div>

      {/* Suggested Skills */}
      {isEditing && (
        <div className="flex flex-wrap gap-2 mt-2">
          {SKILL_SUGGESTIONS.filter((s) => !form.skills.includes(s)).map((skill) => (
            <button
              key={skill}
              onClick={() => addSuggestedSkill(skill)}
              className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition"
            >
              {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSkills;
