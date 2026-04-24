import appointmentModel from "../models/appointmentModel.js";
import { sendEmail, buildInviteEmail } from "./mailer.js";
import { env } from "../config/env.js";

export const startAppointmentReminderScheduler = () => {
  setInterval(async () => {
    try {
      const now = new Date();
      const reminderWindowStart = new Date(now.getTime() + 9 * 60 * 1000);
      const reminderWindowEnd = new Date(now.getTime() + 11 * 60 * 1000);

      const appointments = await appointmentModel.find({
        slotDateTime: { $gte: reminderWindowStart, $lte: reminderWindowEnd },
        status: "confirmed",
        paymentStatus: "paid",
        inviteEmailSent: false,
      });

      for (const appointment of appointments) {
        const meetingLink =
          appointment.meetingLink ||
          `${env.frontendUrl}/call/${appointment._id}`;

        const userEmailData = buildInviteEmail({
          recipientName: appointment.userDetails?.name || appointment.userEmail,
          appointment,
          meetingLink,
        });

        const adminEmailData = buildInviteEmail({
          recipientName: "Admin",
          appointment,
          meetingLink,
        });

        await Promise.all([
          sendEmail({ to: appointment.userEmail, ...userEmailData }),
          sendEmail({ to: env.adminEmail, ...adminEmailData }),
        ]);

        appointment.inviteEmailSent = true;
        appointment.inviteEmailSentAt = new Date();
        await appointment.save();
      }
    } catch (error) {
      console.error("Reminder scheduler error:", error);
    }
  }, 60 * 1000);
};
