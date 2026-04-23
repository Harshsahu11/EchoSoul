import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import serviceModel from "../models/serviceModel.js";

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, serviceId, date, time, notes } = req.body;

    // Get user and service details
    const user = await userModel.findById(userId);
    const service = await serviceModel.findById(serviceId);

    if (!user || !service) {
      return res.json({ success: false, message: "User or Service not found" });
    }

    // Create slot date time
    const [year, month, day] = date.split("-").map(Number);
    const [timeValue, meridiem] = time.split(" ");
    const [rawHours, minutes] = timeValue.split(":").map(Number);

    let hours = rawHours % 12;
    if (meridiem === "PM") {
      hours += 12;
    }

    const slotDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

    // Check if slot is already booked
    const existingAppointment = await appointmentModel.findOne({
      serviceId,
      slotDateTime,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res.json({ success: false, message: "Slot already booked" });
    }

    const appointmentData = {
      userId,
      userEmail: user.email,
      serviceId,
      serviceTitle: service.title,
      serviceName: service.title,
      date,
      time,
      slotDateTime,
      userDetails: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      notes: notes || "",
      paymentAmount: service.price,
    };

    const appointment = new appointmentModel(appointmentData);
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment booked successfully",
      appointmentId: appointment._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.body;

    const appointments = await appointmentModel
      .find({ userId })
      .populate("serviceId", "title image coach duration price")
      .sort({ createdAt: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get appointment by appointment id
const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await appointmentModel.findOne({
      $or: [{ _id: appointmentId }, { localAppointmentId: appointmentId }],
    });

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { userId } = req.body;

    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      userId,
    });

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Check if appointment can be cancelled (not within 24 hours)
    const appointmentTime = new Date(appointment.slotDateTime);
    const currentTime = new Date();
    const timeDiff = appointmentTime - currentTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return res.json({
        success: false,
        message: "Cannot cancel appointment within 24 hours",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      status: "cancelled",
    });

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments (Admin only)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate("userId", "name email phone")
      .populate("serviceId", "title coach price")
      .sort({ createdAt: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update appointment status (Admin only)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const validStatuses = ["confirmed", "completed", "cancelled", "no-show"];
    if (!validStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { status });

    res.json({ success: true, message: "Appointment status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get available slots for a service and date
const getAvailableSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    const timeSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
    ];

    // Get booked slots for the date
    const [year, month, day] = date.split("-").map(Number);
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const bookedAppointments = await appointmentModel.find({
      serviceId,
      slotDateTime: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "cancelled" },
    });

    const bookedSlots = bookedAppointments.map((apt) => apt.time);

    const availableSlots = timeSlots.filter(
      (slot) => !bookedSlots.includes(slot),
    );

    res.json({ success: true, availableSlots });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  bookAppointment,
  getUserAppointments,
  getAppointmentById,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getAvailableSlots,
};
