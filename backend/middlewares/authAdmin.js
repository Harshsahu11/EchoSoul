import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized. Login again.",
      });
    }

    const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET);
    if (
      !tokenDecode ||
      tokenDecode.role !== "admin" ||
      tokenDecode.email !== process.env.ADMIN_EMAIL
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
