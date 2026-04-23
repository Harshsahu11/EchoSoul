import jwt from "jsonwebtoken";

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get admin profile
const getAdminProfile = async (req, res) => {
  try {
    // For now, return basic admin info
    res.json({
      success: true,
      adminData: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const appointmentModel = (await import("../models/appointmentModel.js"))
      .default;
    const userModel = (await import("../models/userModel.js")).default;
    const serviceModel = (await import("../models/serviceModel.js")).default;
    const contactModel = (await import("../models/contactModel.js")).default;

    const totalUsers = await userModel.countDocuments();
    const totalServices = await serviceModel.countDocuments();
    const totalAppointments = await appointmentModel.countDocuments();
    const pendingContacts = await contactModel.countDocuments({
      status: "new",
    });

    // Get recent appointments
    const recentAppointments = await appointmentModel
      .find({})
      .populate("userId", "name email")
      .populate("serviceId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get appointment stats by status
    const appointmentStats = await appointmentModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalServices,
        totalAppointments,
        pendingContacts,
        recentAppointments,
        appointmentStats,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginAdmin, getAdminProfile, getDashboardStats };
