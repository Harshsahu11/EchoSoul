import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  localAppointmentId: {
    type: String,
    trim: true,
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service",
  },
  serviceTitle: {
    type: String,
    required: true,
    trim: true,
  },
  serviceName: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  slotDateTime: {
    type: Date,
    required: true,
  },
  userDetails: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "completed", "cancelled", "no-show"],
    default: "confirmed",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  paymentAmount: {
    type: Number,
    min: 0,
  },
  meetingLink: {
    type: String,
    trim: true,
    default: "",
  },
  inviteEmailSent: {
    type: Boolean,
    default: false,
  },
  inviteEmailSentAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
appointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
appointmentSchema.index({ userId: 1, date: 1 });
appointmentSchema.index({ userEmail: 1 });
appointmentSchema.index({ serviceId: 1 });
appointmentSchema.index({ slotDateTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ paymentStatus: 1 });

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
