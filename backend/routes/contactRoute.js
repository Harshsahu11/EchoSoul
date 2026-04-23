import express from "express";
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";
import authAdmin from "../middlewares/authAdmin.js";

const contactRouter = express.Router();

contactRouter.post("/submit", submitContact);

// Admin routes
contactRouter.get("/all", authAdmin, getAllContacts);
contactRouter.post("/update-status", authAdmin, updateContactStatus);
contactRouter.delete("/delete/:contactId", authAdmin, deleteContact);

export default contactRouter;
