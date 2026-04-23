import express from "express";
import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  updateProfileImage,
} from "../controllers/userController.js";
import authUser from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", authUser, updateProfile);
userRouter.post(
  "/update-profile-image",
  authUser,
  upload.single("image"),
  updateProfileImage,
);

export default userRouter;
