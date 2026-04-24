import express from "express";
import {
  bookAppointment,
  getUserAppointments,
  getAppointmentById,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getAvailableSlots,
} from "../controllers/appointmentController.js";
import authUser from "../middlewares/auth.js";
import authAdmin from "../middlewares/authAdmin.js";

const appointmentRouter = express.Router();

appointmentRouter.post("/book", authUser, bookAppointment);
appointmentRouter.get("/user-appointments", authUser, getUserAppointments);
appointmentRouter.post("/cancel", authUser, cancelAppointment);
appointmentRouter.get("/available-slots", getAvailableSlots);

// Admin routes
appointmentRouter.get("/all", authAdmin, getAllAppointments);
appointmentRouter.get("/list", authAdmin, getAllAppointments);
appointmentRouter.post("/update-status", authAdmin, updateAppointmentStatus);
appointmentRouter.get("/:appointmentId", authUser, getAppointmentById);

export default appointmentRouter;
