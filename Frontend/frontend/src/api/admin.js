import API from './axios';

export const adminAPI = {
  // Login admin
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/admin/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get admin dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await API.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all patients
  getAllPatients: async () => {
    try {
      const response = await API.get('/patients');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all doctors
  getAllDoctors: async () => {
    try {
      const response = await API.get('/doctors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create doctor
  createDoctor: async (doctorData) => {
    try {
      const response = await API.post('/doctors', doctorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update doctor
  updateDoctor: async (doctorId, doctorData) => {
    try {
      const response = await API.put(`/doctors/${doctorId}`, doctorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete doctor
  deleteDoctor: async (doctorId) => {
    try {
      const response = await API.delete(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all appointments
  getAllAppointments: async () => {
    try {
      const response = await API.get('/appointments/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all bills for revenue calculation
  getAllBills: async () => {
    try {
      const response = await API.get('/bills/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Service management
  getAllServices: async () => {
    try {
      const response = await API.get('/services');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createService: async (serviceData) => {
    try {
      const response = await API.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateService: async (serviceId, serviceData) => {
    try {
      const response = await API.put(`/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteService: async (serviceId) => {
    try {
      const response = await API.delete(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
