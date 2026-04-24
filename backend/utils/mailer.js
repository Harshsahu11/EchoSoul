import nodemailer from "nodemailer";
import { env, requireEnvGroup } from "../config/env.js";

let transport;

const getTransport = () => {
  requireEnvGroup("SMTP", {
    SMTP_HOST: env.smtp.host,
    SMTP_USER: env.smtp.user,
    SMTP_PASS: env.smtp.pass,
  });

  if (!transport) {
    transport = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }

  return transport;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const message = {
    from: env.smtp.from,
    to,
    subject,
    text: text || html.replace(/<[^>]*>?/gm, ""),
    html,
  };

  const result = await getTransport().sendMail(message);
  return result;
};

export const buildInviteEmail = ({
  recipientName,
  appointment,
  meetingLink,
}) => {
  return {
    subject: `Your EchoSoul meeting starts in 10 minutes`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2 style="color: #0ea5e9;">Meeting Reminder</h2>
        <p>Hi ${recipientName},</p>
        <p>Your appointment for <strong>${appointment.serviceTitle}</strong> is scheduled at <strong>${appointment.date} ${appointment.time}</strong>.</p>
        <p>Please join the meeting using the link below when it is time:</p>
        <p><a href="${meetingLink}" style="color: #0ea5e9;">Join Video Call</a></p>
        <p>If the button does not work, copy and paste this URL into your browser:</p>
        <p>${meetingLink}</p>
        <p>See you soon!</p>
      </div>
    `,
  };
};
