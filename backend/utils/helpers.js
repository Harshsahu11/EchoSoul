// Email utility (placeholder for future email integration)
export const sendEmail = async (to, subject, html) => {
  // Placeholder for email service integration (e.g., Nodemailer, SendGrid)
  console.log(`Email sent to ${to}: ${subject}`);
  return true;
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Date utilities
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatTime = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
};

// Currency formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Pagination utility
export const getPagination = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};
