import Service from "../models/service.js";

class ServiceController {

  // Create a new service
  static async createService(req, res) {
    try {
      const { name, price, description, category } = req.body;

      if (!name || !price || !description) {
        return res.status(400).json({ message: "Name, price, and description are required" });
      }

      // Check if service already exists
      const existingService = await Service.findOne({ name });
      if (existingService) {
        return res.status(400).json({ message: "Service with this name already exists" });
      }

      const newService = new Service({
        name,
        price,
        description,
        category
      });

      await newService.save();
      return res.status(201).json({ message: "Service created successfully", service: newService });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get all services
  static async getAllServices(req, res) {
    try {
      const services = await Service.find({ isActive: true }).sort({ name: 1 });
      return res.status(200).json({ services });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Get service by ID
  static async getServiceById(req, res) {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      return res.status(200).json({ service });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Update service
  static async updateService(req, res) {
    try {
      const { name, price, description, category, isActive } = req.body;
      const serviceId = req.params.id;

      const service = await Service.findByIdAndUpdate(
        serviceId,
        { name, price, description, category, isActive },
        { new: true, runValidators: true }
      );

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      return res.status(200).json({ message: "Service updated successfully", service });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Delete service (soft delete - set isActive to false)
  static async deleteService(req, res) {
    try {
      const serviceId = req.params.id;
      
      const service = await Service.findByIdAndUpdate(
        serviceId,
        { isActive: false },
        { new: true }
      );

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      return res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default ServiceController;
