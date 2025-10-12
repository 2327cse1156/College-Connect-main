import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, CheckCircle, XCircle, Clock, Eye, X, User } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  studentIdUrl: string;
  createdAt: string;
  yearOfAdmission?: string;
  college?: string;
  course?: string;
  branch?: string;
}
interface Stats {
  totalUsers: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  recentRegistrations: number;
}
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`${color} text-white p-3 rounded-lg`}>{icon}</div>
    </div>
  </div>
);
function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/pending-users`, { withCredentials: true }),
        axios.get(`${API_URL}/admin/stats`, { withCredentials: true }),
      ]);

      setPendingUsers(pendingRes.data.users);
      setStats(statsRes.data.stats);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async (userId: string) => {
    if (!confirm("Are you sure want to approve this user>")) return;
    setActionLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/approve/${userId}`,
        {},
        { withCredentials: true }
      );

      toast.success("User approved successfully!");
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      console.error("Approve error:", error);
      toast.error(error.response?.data?.error || "Failed to approve user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (userId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    if (!confirm("Are you sure you want to reject this user?")) return;

    setActionLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/reject/${userId}`,
        { reason: rejectionReason },
        { withCredentials: true }
      );

      toast.success("User rejected");
      setShowModal(false);
      setRejectionReason("");
      fetchData();
    } catch (error: any) {
      console.error("Reject error:", error);
      toast.error(error.response?.data?.error || "Failed to reject user");
    } finally {
      setActionLoading(false);
    }
  };

  const viewUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
    setRejectionReason("");
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage user verifications and platform statistics.
          </p>
        </div>
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              title="Total Users"
              value={stats.totalUsers}
              color="bg-blue-500"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              title="Pending"
              value={stats.pendingCount}
              color="bg-yellow-500"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              color="bg-green-500"
              title="Approved"
              value={stats.approvedCount}
            />
            <StatCard
              icon={<XCircle className="w-6 h-6" />}
              color="bg-red-500"
              title="Rejected"
              value={stats.rejectedCount}
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Verifications ({pendingUsers.length})
            </h2>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-600">
                No pending verifications at the moment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.college || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => viewUser(user)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Student Verification
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Close"
                aria-label="Close"
              >
                <X className="w-6 h-6"></X>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">College</p>
                    <p className="font-medium text-gray-900">
                      {selectedUser.college || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Course</p>
                    <p className="font-medium text-gray-900">
                      {selectedUser.course || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Student ID Card
                </p>
                {selectedUser.studentIdUrl ? (
                  selectedUser.studentIdUrl.endsWith(".pdf") ? (
                    <div className="border rounded-lg p-4 text-center">
                      <a
                        href={selectedUser.studentIdUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        📄 Open PDF in New Tab
                      </a>
                    </div>
                  ) : (
                    <img
                      src={selectedUser.studentIdUrl}
                      alt="Student ID"
                      className="w-full rounded-lg border"
                    ></img>
                  )
                ) : (
                  <p className="text-gray-500 text-center py-8 border rounded-lg">
                    No ID uploaded
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (Optional)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Provide a reason if rejecting...."
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>{" "}
              <button
                onClick={() => handleReject(selectedUser._id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Reject"}
              </button>
              <button
                onClick={() => handleApprove(selectedUser._id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
