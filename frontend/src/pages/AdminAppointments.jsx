import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchAppointments();
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:3000/api/appointment/all",
        {
          headers: {
            atoken: token,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:3000/api/appointment/update-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            atoken: token,
          },
          body: JSON.stringify({ appointmentId, status }),
        },
      );

      const data = await response.json();
      if (data.success) {
        fetchAppointments(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-slate-400 hover:text-white transition duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-sky-400">
              Manage Appointments
            </h1>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin/login");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {["all", "confirmed", "completed", "cancelled", "no-show"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  filter === status
                    ? "bg-sky-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-8 text-center border border-white/10">
              <p className="text-slate-400">No appointments found</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-slate-400 text-sm">Client</p>
                        <p className="text-white font-medium">
                          {appointment.userDetails?.name}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {appointment.userDetails?.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Service</p>
                        <p className="text-white font-medium">
                          {appointment.serviceTitle}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {appointment.serviceId?.coach}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Date & Time</p>
                        <p className="text-white font-medium">
                          {appointment.date}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {appointment.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Payment</p>
                        <p className="text-white font-medium">
                          ₹{appointment.paymentAmount}
                        </p>
                        <p
                          className={`text-sm ${
                            appointment.paymentStatus === "paid"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {appointment.paymentStatus}
                        </p>
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mb-4">
                        <p className="text-slate-400 text-sm">Notes</p>
                        <p className="text-white">{appointment.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <select
                      value={appointment.status}
                      onChange={(e) =>
                        updateAppointmentStatus(appointment._id, e.target.value)
                      }
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                    <p className="text-xs text-slate-400">
                      Created:{" "}
                      {new Date(appointment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
