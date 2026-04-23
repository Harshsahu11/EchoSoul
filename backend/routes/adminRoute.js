import express from "express";
import {
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.get("/profile", authAdmin, getAdminProfile);
adminRouter.get("/dashboard-stats", authAdmin, getDashboardStats);

export default adminRouter;
