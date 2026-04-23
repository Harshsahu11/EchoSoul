import express from "express";
import cors from "cors";
import "dotenv/config";
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
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

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

server.listen(PORT, () => {
  console.log("Server Started at : ", PORT);
});
