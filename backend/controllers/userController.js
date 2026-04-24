import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import { env } from "../config/env.js";

// API for user login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, env.jwtSecret);
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          image: user.image,
          fee: user.fee,
          about: user.about,
        },
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Login failed. Please try again." });
  }
};

// API to register user
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate all fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid name" });
    }
    if (!email || !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }
    if (!phone || !/^\d{10,15}$/.test(phone)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid phone number" });
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
    });

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, env.jwtSecret, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || "",
        image: user.image || "",
        fee: user.fee || "",
        about: user.about || "",
      },
    });
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Signup failed. Please try again." });
  }
};

// API to get user profile data
const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).select("-password");

    res.json({ success: true, user });
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Failed to fetch profile." });
  }
};

// API to update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { userId, name, phone, address, gender, birthday } = req.body;

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address,
      gender,
      birthday,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Failed to update profile." });
  }
};

// API to update user profile image
const updateProfileImage = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "Image file is required" });
    }

    // Upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageURL = imageUpload.secure_url;

    await userModel.findByIdAndUpdate(userId, { image: imageURL });

    res.json({ success: true, message: "Profile image updated", imageURL });
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Failed to update profile image." });
  }
};

export {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  updateProfileImage,
};
