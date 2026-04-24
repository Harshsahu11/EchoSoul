import axios from "axios";

// Get API URL from environment variables
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization token to requests
apiClient.interceptors.request.use(
  (config) => {
    // For user endpoints, use 'token' header
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }

    // For admin endpoints, use 'atoken' header
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.atoken = adminToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("echosoulCurrentUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// User API calls
export const userAPI = {
  login: (email, password) =>
    apiClient.post("/api/user/login", { email, password }),

  register: (name, email, password, phone) =>
    apiClient.post("/api/user/register", { name, email, password, phone }),

  getProfile: () => apiClient.get("/api/user/get-profile"),

  updateProfile: (userData) =>
    apiClient.post("/api/user/update-profile", userData),

  updateProfileImage: (formData) =>
    apiClient.post("/api/user/update-profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Service API calls
export const serviceAPI = {
  getServices: () => apiClient.get("/api/service/list"),

  getServiceById: (id) => apiClient.get(`/api/service/${id}`),

  addService: (serviceData) =>
    apiClient.post("/api/service/add", serviceData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateService: (id, serviceData) =>
    apiClient.put(`/api/service/update/${id}`, serviceData),

  deleteService: (id) => apiClient.delete(`/api/service/delete/${id}`),
};

// Appointment API calls
export const appointmentAPI = {
  getAppointments: () => apiClient.get("/api/appointment/all"),

  getUserAppointments: () =>
    apiClient.get("/api/appointment/user-appointments"),

  bookAppointment: (appointmentData) =>
    apiClient.post("/api/appointment/book", appointmentData),

  cancelAppointment: (id) =>
    apiClient.post("/api/appointment/cancel", { appointmentId: id }),

  updateAppointmentStatus: (id, status) =>
    apiClient.post("/api/appointment/update-status", {
      appointmentId: id,
      status,
    }),
};

// Contact API calls
export const contactAPI = {
  sendMessage: (contactData) =>
    apiClient.post("/api/contact/submit", contactData),

  getContacts: () => apiClient.get("/api/contact/all"),

  updateContactStatus: (id, status) =>
    apiClient.post("/api/contact/update-status", { contactId: id, status }),

  deleteContact: (id) => apiClient.delete(`/api/contact/delete/${id}`),
};

// Admin API calls
export const adminAPI = {
  login: (email, password) =>
    apiClient.post("/api/admin/login", { email, password }),

  getDashboardStats: () => apiClient.get("/api/admin/dashboard-stats"),
};

// Payment API calls
export const paymentAPI = {
  createOrder: (appointmentData) =>
    apiClient.post("/api/payment/create-order", appointmentData),

  verifyPayment: (paymentData) =>
    apiClient.post("/api/payment/verify", paymentData),
};

export default apiClient;
