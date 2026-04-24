import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { startAppointmentReminderScheduler } from "./utils/scheduler.js";

// Routes
import userRouter from "./routes/userRoute.js";
import serviceRouter from "./routes/serviceRoute.js";
import appointmentRouter from "./routes/appointmentRoute.js";
import contactRouter from "./routes/contactRoute.js";
import adminRouter from "./routes/adminRoute.js";
import paymentRouter from "./routes/paymentRoute.js";

//app config
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.frontendUrl,
    methods: ["GET", "POST"],
  },
});
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());

// CORS configuration based on environment
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      env.frontendUrl,
      process.env.PROD_FRONTEND_URL,
      process.env.DEV_FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, curl requests, etc)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//api end point
app.use("/api/user", userRouter);
app.use("/api/service", serviceRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

// Centralized error handler middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (!env.isProduction && err.stack) {
    console.error(err.stack);
  }
  res.status(status).json({ success: false, message });
});

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    const clients = [...(io.sockets.adapter.rooms.get(roomId) || [])];
    const initiatorId = clients[0];

    socket.to(roomId).emit("peer-joined", {
      peerId: socket.id,
      initiatorId,
    });

    if (clients.length === 2) {
      io.to(roomId).emit("start-call", { initiatorId });
    }
  });

  socket.on("signal", ({ to, type, data }) => {
    if (to) {
      io.to(to).emit("signal", {
        from: socket.id,
        type,
        data,
      });
      return;
    }

    if (socket.roomId) {
      socket.to(socket.roomId).emit("signal", {
        from: socket.id,
        type,
        data,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});

startAppointmentReminderScheduler();

server.listen(env.port, () => {
  console.log("Server Started at : ", env.port);
});
