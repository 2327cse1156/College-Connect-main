import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Calendar, CheckCircle, ExternalLink, Filter, MapPin, Search, Users } from "lucide-react";
interface Hackathon {
  _id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  type: "In-Person" | "Online" | "Hybrid";
  prizes: string;
  expectedParticipants: string;
  registrationOpen: boolean;
  websiteUrl: string;
  tags: string[];
  registeredUsers: string[];
}
function Hackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { currentUser } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchHackathons();
  }, []);
  useEffect(() => {
    filterHackathons();
  }, [searchQuery, typeFilter, statusFilter, hackathons]);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/hackathons`);
      setHackathons(res.data.hackathons);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load hackathons");
    } finally {
      setLoading(false);
    }
  };
  const filterHackathons = () => {
    let filtered = [...hackathons];

    if (searchQuery) {
      filtered = filtered.filter((h) =>
        h.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((h) => h.type === typeFilter);
    }

    if (statusFilter === "open") {
      filtered = filtered.filter((h) => h.registrationOpen);
    } else if (statusFilter === "closed") {
      filtered = filtered.filter((h) => !h.registrationOpen);
    }
    setFilteredHackathons(filtered);
  };

  const handleRegister = async (hackathonId: string) => {
    if (!currentUser) {
      toast.error("Please login to register");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/hackathons/${hackathonId}/register`,
        {},
        { withCredentials: true }
      );
      toast.success("Registered successfully!");
      fetchHackathons();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
    }
  };

  const handleUnregister = async (hackathonId: string) => {
    try {
      await axios.post(
        `${API_URL}/hackathons/${hackathonId}/unregister`,
        {},
        { withCredentials: true }
      );
      toast.success("Unregistered successfully");
      fetchHackathons();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to unregister");
    }
  };

  const isRegistered = (hackathon: Hackathon) => {
    return currentUser && hackathon.registeredUsers.includes(currentUser._id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Upcoming Hackathons
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover upcoming hackathons, form teams, and showcase your skills.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search hackathons...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            aria-label="Filter by hackathon type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg text-gray-700"
          >
            <option value="all">All Types</option>
            <option value="In-Person">In-Person</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select
            aria-label="Filter by registration status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg text-gray-700"
          >
            <option value="all">All Status</option>
            <option value="open">Registration Open</option>
            <option value="closed">Registration Closed</option>
          </select>

          <button className="flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {filteredHackathons.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p>No Hackathons Found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHackathons.map((hackathon) => (
              <div
                key={hackathon._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={
                    hackathon.image ||
                    "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  }
                  alt="Hackathon image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {hackathon.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(
                        hackathon.startDate
                      ).toLocaleDateString()} -{" "}
                      {new Date(hackathon.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {hackathon.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {hackathon.expectedParticipants} participants expected
                    </div>
                  </div>

                  {hackathon.tags && hackathon.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {hackathon.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    {hackathon.prizes && (
                      <span className="text-sm font-medium text-indigo-600">
                        Prize: {hackathon.prizes}
                      </span>
                    )}
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        hackathon.registrationOpen
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {hackathon.registrationOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                                    <div className="flex space-x-2">
                    {isRegistered(hackathon) ? (
                      <>
                        <button
                          onClick={() => handleUnregister(hackathon._id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Unregister
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRegister(hackathon._id)}
                        disabled={!hackathon.registrationOpen}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Register Now
                      </button>
                    )}

                    {hackathon.websiteUrl && (
                      <a
                        href={hackathon.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Visit hackathon website"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        <ExternalLink className="h-5 w-5 text-gray-600" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hackathons;
