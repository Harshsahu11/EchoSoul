import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
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
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["new", "read", "replied", "closed"],
    default: "new",
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
contactSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

const contactModel =
  mongoose.models.contact || mongoose.model("contact", contactSchema);

export default contactModel;
