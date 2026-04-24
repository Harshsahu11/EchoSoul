import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "../config/env.js";

// API for admin login
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email === env.adminEmail) {
      const isMatch = env.adminPasswordHash
        ? await bcrypt.compare(password, env.adminPasswordHash)
        : password === env.adminPassword;

      if (isMatch) {
        const token = jwt.sign({ email, role: "admin" }, env.jwtSecret, {
          expiresIn: "8h",
        });
        return res.json({ success: true, token });
      }
    }
    res.json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Failed to login as admin." });
  }
};

// API to get admin profile
const getAdminProfile = async (req, res, next) => {
  try {
    // For now, return basic admin info
    res.json({
      success: true,
      adminData: {
        email: env.adminEmail,
        role: "admin",
      },
    });
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Failed to fetch admin profile." });
  }
};

// API to get dashboard stats
const getDashboardStats = async (req, res, next) => {
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
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Failed to fetch dashboard data." });
  }
};

export { loginAdmin, getAdminProfile, getDashboardStats };
