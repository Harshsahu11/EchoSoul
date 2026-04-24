import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const pickUrl = (primary, productionValue, developmentValue, fallback) => {
  return (
    process.env[primary] ||
    (isProduction ? process.env[productionValue] : process.env[developmentValue]) ||
    fallback
  );
};

const requiredCoreEnv = ["MONGO_URI", "JWT_SECRET", "ADMIN_EMAIL"];
const missingCoreEnv = requiredCoreEnv.filter((key) => !process.env[key]);

if (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD) {
  missingCoreEnv.push("ADMIN_PASSWORD_HASH or ADMIN_PASSWORD");
}

if (missingCoreEnv.length > 0) {
  throw new Error(
    `Missing required backend environment variable(s): ${missingCoreEnv.join(
      ", ",
    )}. Check backend/.env.`,
  );
}

export const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 4000,
  frontendUrl: pickUrl(
    "FRONTEND_URL",
    "PROD_FRONTEND_URL",
    "DEV_FRONTEND_URL",
    "http://localhost:5173",
  ),
  backendUrl: pickUrl(
    "BACKEND_URL",
    "PROD_BACKEND_URL",
    "DEV_BACKEND_URL",
    "http://localhost:4000",
  ),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
  adminPassword: process.env.ADMIN_PASSWORD,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET_KEY,
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
  },
};

export const requireEnvGroup = (label, values) => {
  const missing = Object.entries(values)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing ${label} environment variable(s): ${missing.join(", ")}.`,
    );
  }
};
