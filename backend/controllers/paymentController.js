import Razorpay from "razorpay";
import crypto from "crypto";
import appointmentModel from "../models/appointmentModel.js";
import { sendEmail, buildInviteEmail } from "../utils/mailer.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
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
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const appointment = await appointmentModel.findById(appointmentId);
      if (!appointment) {
        return res.json({ success: false, message: "Appointment not found" });
      }

      const meetingLink = `${process.env.FRONTEND_URL}/call/${appointment._id}`;

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
        sendEmail({ to: process.env.ADMIN_EMAIL, ...adminEmailData }),
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
