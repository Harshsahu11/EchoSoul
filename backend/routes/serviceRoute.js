import express from "express";
import {
  getAllServices,
  getServicesByCategory,
  getServiceById,
  addService,
  updateService,
  deleteService,
  searchServices,
} from "../controllers/serviceController.js";
import authAdmin from "../middlewares/authAdmin.js";
import upload from "../middlewares/multer.js";

const serviceRouter = express.Router();

serviceRouter.get("/list", getAllServices);
serviceRouter.get("/category/:category", getServicesByCategory);
serviceRouter.get("/search", searchServices);
serviceRouter.get("/:serviceId", getServiceById);

// Admin routes
serviceRouter.post("/add", authAdmin, upload.single("image"), addService);
serviceRouter.put(
  "/update/:serviceId",
  authAdmin,
  upload.single("image"),
  updateService,
);
serviceRouter.delete("/delete/:serviceId", authAdmin, deleteService);

export default serviceRouter;
