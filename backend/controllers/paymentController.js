import Razorpay from "razorpay";
import crypto from "crypto";
import appointmentModel from "../models/appointmentModel.js";
import { sendEmail, buildInviteEmail } from "../utils/mailer.js";
import { env, requireEnvGroup } from "../config/env.js";

let razorpay;

const getRazorpay = () => {
  requireEnvGroup("Razorpay", {
    RAZORPAY_KEY_ID: env.razorpay.keyId,
    RAZORPAY_KEY_SECRET: env.razorpay.keySecret,
  });

  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: env.razorpay.keyId,
      key_secret: env.razorpay.keySecret,
    });
  }

  return razorpay;
};

// API to create payment order
const createPaymentOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    const options = {
      amount: appointment.paymentAmount * 100, // Razorpay expects amount in paisa
      currency: "INR",
      receipt: `receipt_${appointmentId}`,
      payment_capture: 1, // Auto capture
    };

    const order = await getRazorpay().orders.create(options);

    res.json({
      success: true,
      order,
      key: env.razorpay.keyId,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify payment
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
    } = req.body;

    // Create expected signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", env.razorpay.keySecret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const appointment = await appointmentModel.findById(appointmentId);
      if (!appointment) {
        return res.json({ success: false, message: "Appointment not found" });
      }

      const meetingLink = `${env.frontendUrl}/call/${appointment._id}`;

      await appointmentModel.findByIdAndUpdate(appointmentId, {
        paymentStatus: "paid",
        meetingLink,
        inviteEmailSent: false,
      });

      // Send immediate confirmation email and allow scheduler to send reminder later
      const userEmailData = buildInviteEmail({
        recipientName: appointment.userDetails?.name || appointment.userEmail,
        appointment: { ...appointment.toObject(), meetingLink },
        meetingLink,
      });

      const adminEmailData = buildInviteEmail({
        recipientName: "Admin",
        appointment: { ...appointment.toObject(), meetingLink },
        meetingLink,
      });

      await Promise.all([
        sendEmail({ to: appointment.userEmail, ...userEmailData }),
        sendEmail({ to: env.adminEmail, ...adminEmailData }),
      ]);

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get payment history for user
const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    const payments = await appointmentModel
      .find({
        userId,
        paymentStatus: "paid",
      })
      .populate("serviceId", "title coach")
      .select("paymentAmount paymentStatus createdAt serviceTitle")
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { createPaymentOrder, verifyPayment, getPaymentHistory };
