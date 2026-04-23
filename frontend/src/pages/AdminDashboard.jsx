import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:3000/api/admin/dashboard-stats",
        {
          headers: {
            atoken: token,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-400">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Services</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalServices}
                  </p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Appointments</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalAppointments}
                  </p>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Contacts</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.pendingContacts}
                  </p>
                </div>
                <div className="bg-orange-500/20 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate("/admin/appointments")}
            className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:bg-slate-800/80 transition duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-sky-500/20 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Manage Appointments
                </h3>
                <p className="text-slate-400 text-sm">
                  View and manage all appointments
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/services")}
            className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:bg-slate-800/80 transition duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Manage Services
                </h3>
                <p className="text-slate-400 text-sm">
                  Add, edit, and remove services
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/contacts")}
            className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:bg-slate-800/80 transition duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-orange-500/20 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Contact Messages
                </h3>
                <p className="text-slate-400 text-sm">
                  View and manage contact forms
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Appointments */}
        {stats && stats.recentAppointments && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Recent Appointments
            </h3>
            <div className="space-y-4">
              {stats.recentAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">
                      {appointment.userDetails?.name}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {appointment.serviceTitle}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : appointment.status === "completed"
                          ? "bg-blue-500/20 text-blue-400"
                          : appointment.status === "cancelled"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {appointment.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
