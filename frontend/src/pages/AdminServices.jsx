import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    coach: "",
    description: "",
    duration: "",
    price: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchServices();
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/service/list");
      const data = await response.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingService
        ? `http://localhost:3000/api/service/update/${editingService._id}`
        : "http://localhost:3000/api/service/add";

      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          atoken: token,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        fetchServices();
        setShowAddForm(false);
        setEditingService(null);
        setFormData({
          title: "",
          coach: "",
          description: "",
          duration: "",
          price: "",
          category: "",
          image: null,
        });
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      coach: service.coach,
      description: service.description,
      duration: service.duration,
      price: service.price,
      category: service.category,
      image: null,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:3000/api/service/delete/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            atoken: token,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const toggleAvailability = async (serviceId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:3000/api/service/update/${serviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            atoken: token,
          },
          body: JSON.stringify({ isAvailable: !currentStatus }),
        },
      );

      const data = await response.json();
      if (data.success) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error updating service availability:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading services...</p>
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
            <h1 className="text-2xl font-bold text-sky-400">Manage Services</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              {showAddForm ? "Cancel" : "Add Service"}
            </button>
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
      </div>

      <div className="p-6">
        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingService ? "Edit Service" : "Add New Service"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Coach
                  </label>
                  <input
                    type="text"
                    name="coach"
                    value={formData.coach}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 30 mins"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white file:bg-slate-700 file:border-0 file:rounded file:px-3 file:py-1 file:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-white"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingService(null);
                  }}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition duration-200"
                >
                  {editingService ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-1">
                    by {service.coach}
                  </p>
                  <p className="text-slate-400 text-sm">{service.category}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      toggleAvailability(service._id, service.isAvailable)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.isAvailable
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {service.isAvailable ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-slate-300 text-sm mb-2">
                  {service.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{service.duration}</span>
                  <span className="text-sky-400 font-semibold">
                    ₹{service.price}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-200 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No services found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
