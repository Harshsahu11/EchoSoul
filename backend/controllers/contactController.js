import contactModel from "../models/contactModel.js";

// API to submit contact form
const submitContact = async (req, res) => {
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
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all contact messages (Admin only)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactModel.find({}).sort({ createdAt: -1 });

    res.json({ success: true, contacts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update contact status (Admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { contactId, status } = req.body;

    const validStatuses = ["new", "read", "replied", "closed"];
    if (!validStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    await contactModel.findByIdAndUpdate(contactId, { status });

    res.json({ success: true, message: "Contact status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to delete contact message (Admin only)
const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    await contactModel.findByIdAndDelete(contactId);

    res.json({ success: true, message: "Contact message deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { submitContact, getAllContacts, updateContactStatus, deleteContact };
