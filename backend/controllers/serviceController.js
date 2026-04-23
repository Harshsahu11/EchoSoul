import serviceModel from "../models/serviceModel.js";
import { v2 as cloudinary } from "cloudinary";

// API to get all services
const getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.find({ isAvailable: true });
    res.json({ success: true, services });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get services by category
const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await serviceModel.find({
      category: { $regex: category, $options: "i" },
      isAvailable: true,
    });
    res.json({ success: true, services });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get service by ID
const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await serviceModel.findById(serviceId);

    if (!service) {
      return res.json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, service });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to add new service (Admin only)
const addService = async (req, res) => {
  try {
    const { title, coach, description, duration, price, category } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "Image file is required" });
    }

    // Upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageURL = imageUpload.secure_url;

    const serviceData = {
      title,
      coach,
      description,
      duration,
      price: Number(price),
      category,
      image: imageURL,
    };

    const service = new serviceModel(serviceData);
    await service.save();

    res.json({ success: true, message: "Service added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update service (Admin only)
const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const {
      title,
      coach,
      description,
      duration,
      price,
      category,
      isAvailable,
    } = req.body;

    const updateData = {
      title,
      coach,
      description,
      duration,
      price: Number(price),
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    };

    // Handle image update if provided
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await serviceModel.findByIdAndUpdate(serviceId, updateData);

    res.json({ success: true, message: "Service updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to delete service (Admin only)
const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    await serviceModel.findByIdAndDelete(serviceId);

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to search services
const searchServices = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.json({ success: false, message: "Search query is required" });
    }

    const services = await serviceModel.find({
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { coach: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
          ],
        },
        { isAvailable: true },
      ],
    });

    res.json({ success: true, services });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  getAllServices,
  getServicesByCategory,
  getServiceById,
  addService,
  updateService,
  deleteService,
  searchServices,
};
