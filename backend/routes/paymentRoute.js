import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
} from "../controllers/paymentController.js";
import authUser from "../middlewares/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", authUser, createPaymentOrder);
paymentRouter.post("/verify", authUser, verifyPayment);
paymentRouter.get("/history", authUser, getPaymentHistory);

export default paymentRouter;
