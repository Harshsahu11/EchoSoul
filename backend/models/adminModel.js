import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "super-admin"],
    default: "admin",
  },
  permissions: [
    {
      type: String,
      enum: [
        "manage-users",
        "manage-services",
        "manage-appointments",
        "manage-contacts",
        "view-analytics",
      ],
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
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
adminSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
adminSchema.index({ email: 1 });

const adminModel =
  mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
