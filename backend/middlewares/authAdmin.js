import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized. Login again.",
      });
    }

    const tokenDecode = jwt.verify(atoken, env.jwtSecret);
    if (
      !tokenDecode ||
      tokenDecode.role !== "admin" ||
      tokenDecode.email !== env.adminEmail
    ) {
      return res.json({
        success: false,
        message: "Not Authorized. Login again.",
      });
    }

    req.admin = tokenDecode;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
