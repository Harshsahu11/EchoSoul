import { env } from "../config/env.js";
import contactModel from "../models/contactModel.js";

// API to submit contact form
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const contactData = {
      name,
      email,
      subject,
      message,
    };

    const contact = new contactModel(contactData);
    await contact.save();

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({
      status: 500,
      message: "Failed to send contact message. Please try again later.",
    });
  }
};

// API to get all contact messages (Admin only)
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactModel.find({}).sort({ createdAt: -1 });

    res.json({ success: true, contacts });
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Failed to fetch contact messages." });
  }
};

// API to update contact status (Admin only)
const updateContactStatus = async (req, res, next) => {
  try {
    const { contactId, id, status } = req.body;
    const contactToUpdate = contactId || id;

    const validStatuses = ["new", "read", "replied", "closed"];
    if (!validStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    await contactModel.findByIdAndUpdate(contactToUpdate, { status });

    res.json({ success: true, message: "Contact status updated" });
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Failed to update contact status." });
  }
};

// API to delete contact message (Admin only)
const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    await contactModel.findByIdAndDelete(contactId);

    res.json({ success: true, message: "Contact message deleted" });
  } catch (error) {
    if (!env.isProduction) {
      console.error(error);
    }
    next({ status: 500, message: "Failed to delete contact message." });
  }
};

export { submitContact, getAllContacts, updateContactStatus, deleteContact };
