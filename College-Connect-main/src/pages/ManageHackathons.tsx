import { useEffect, useState } from "react";
import { X, Plus, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
interface Hackathon {
  _id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: string;
  organizerName: string;
  organizerEmail: string;
  prizes: string;
  expectedParticipants: string;
  registrationDeadline: string;
  websiteUrl: string;
  tags: string;
  requirements: string;
}
function ManageHackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentHackathon, setCurrentHackathon] = useState<Hackathon | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const emptyForm: Hackathon = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    type: "In-Person",
    organizerName: "",
    organizerEmail: "",
    prizes: "",
    expectedParticipants: "",
    registrationDeadline: "",
    websiteUrl: "",
    tags: "",
    requirements: "",
  };

  const [form, setForm] = useState<Hackathon>(emptyForm);

  const fetchHackathons = async () => {
    try {
      const res = await axios.get(`${API_URL}/hackathons`,{withCredentials:true});
      setHackathons(res.data.hackathons);
    } catch (error) {
      toast.error("Failed to load hackathons");
    }
  };
  useEffect(()=>{
    fetchHackathons();
  },[])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editMode && currentHackathon?._id) {
        await axios.put(
          `${API_URL}/hackathons/${currentHackathon._id}`,
          formData,
          { withCredentials: true }
        );
        toast.success("Hackathon updated!");
      } else {
        await axios.post(`${API_URL}/hackathons`, formData, {
          withCredentials: true,
        });
        toast.success("Hackathon created!");
      }

      setShowModal(false);
      setForm(emptyForm);
      setImageFile(null);
      fetchHackathons();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hackathon: any) => {
    setEditMode(true);
    setCurrentHackathon(hackathon);
    setForm({
      ...hackathon,
      startDate: hackathon.startDate.split("T")[0],
      endDate: hackathon.endDate.split("T")[0],
      registrationDeadline: hackathon.registrationDeadline?.split("T")[0] || "",
      tags: hackathon.tags.join(", "),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hackathon?")) return;

    try {
      await axios.delete(`${API_URL}/hackathons/${id}`, {
        withCredentials: true,
      });
      toast.success("Hackathon deleted");
      fetchHackathons();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };
  const openAddModal = () => {
    setEditMode(false);
    setCurrentHackathon(null);
    setForm(emptyForm);
    setImageFile(null);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Hackathons
            </h1>
            <p className="text-gray-600 mt-2">
              Add, edit, or remove hackathons
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            title="Add Hackathon"
          >
            <Plus className="mr-2 w-5 h-5" />
            Add Hackathon
          </button>
        </div>
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {hackathons.map((h: any) => (
                <tr key={h._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {h.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {h.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{h.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(h.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(h)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Edit Hackathon"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(h._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Hackathon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="flex justify-between items-center p-6 border-b">
              <button onClick={() => setShowModal(false)} title="Close Modal">
                <X className="w-6 h-6" />
              </button>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description *
                  </label>
                  <textarea
                    title="Description"
                    placeholder="Enter hackathon description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    required
                    className="w-full border rounded-lg px-3 py-2"
                    title="Location"
                    placeholder="Enter hackathon location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type *
                  </label>
                  <select
                    title="Type"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Prizes
                  </label>
                  <input
                    type="text"
                    value={form.prizes}
                    onChange={(e) =>
                      setForm({ ...form, prizes: e.target.value })
                    }
                    placeholder="e.g., $5000"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expected Participants
                  </label>
                  <input
                    type="text"
                    value={form.expectedParticipants}
                    onChange={(e) =>
                      setForm({ ...form, expectedParticipants: e.target.value })
                    }
                    placeholder="e.g., 500+"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full border rounded-lg px-3 py-2"
                    title="Upload hackathon image"
                    placeholder="Choose an image file"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="AI, Web3, Mobile"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={form.websiteUrl}
                    onChange={(e) =>
                      setForm({ ...form, websiteUrl: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageHackathons;
