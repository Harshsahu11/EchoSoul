import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  const message = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text: text || html.replace(/<[^>]*>?/gm, ""),
    html,
  };

  const result = await transport.sendMail(message);
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
