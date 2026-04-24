import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contactAPI } from "../services/api";

const AdminContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchContacts();
  }, [navigate]);

  const fetchContacts = async () => {
    try {
      const response = await contactAPI.getContacts();
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId, status) => {
    try {
      const response = await contactAPI.updateContactStatus(contactId, status);
      if (response.data.success) {
        fetchContacts(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const deleteContact = async (contactId) => {
    if (
      !window.confirm("Are you sure you want to delete this contact message?")
    ) {
      return;
    }

    try {
      const response = await contactAPI.deleteContact(contactId);
      if (response.data.success) {
        fetchContacts();
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (filter === "all") return true;
    return contact.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading contact messages...</p>
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
              Contact Messages
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
          {["all", "new", "read", "replied", "closed"].map((status) => (
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
          ))}
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-8 text-center border border-white/10">
              <p className="text-slate-400">No contact messages found</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-400 text-sm">From</p>
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-slate-400 text-sm">
                          {contact.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Subject</p>
                        <p className="text-white font-medium">
                          {contact.subject}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {new Date(contact.createdAt).toLocaleDateString()} at{" "}
                          {new Date(contact.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-slate-400 text-sm mb-2">Message</p>
                      <p className="text-white bg-slate-800/50 p-3 rounded-lg">
                        {contact.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <select
                      value={contact.status}
                      onChange={(e) =>
                        updateContactStatus(contact._id, e.target.value)
                      }
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => deleteContact(contact._id)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 text-sm font-medium"
                    >
                      Delete
                    </button>
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

export default AdminContacts;
