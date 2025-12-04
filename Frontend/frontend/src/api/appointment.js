import API from './axios';

export const appointmentAPI = {
  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await API.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all appointments for the logged-in patient
  getPatientAppointments: async () => {
    try {
      const response = await API.get('/appointments/mine');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete an appointment
  deleteAppointment: async (appointmentId) => {
    try {
      const response = await API.delete(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all appointments (admin only)
  getAllAppointments: async () => {
    try {
      const response = await API.get('/appointments');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single appointment by ID
  getAppointmentById: async (id) => {
    try {
      const response = await API.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
