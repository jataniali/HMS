import API from './axios';

export const doctorDashboardAPI = {
  // Get doctor profile
  getDoctorProfile: async () => {
    try {
      const response = await API.get('/doctor-dashboard/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update doctor profile
  updateDoctorProfile: async (profileData) => {
    try {
      const response = await API.put('/doctor-dashboard/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get assigned patients
  getAssignedPatients: async () => {
    try {
      const response = await API.get('/doctor-dashboard/patients');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get doctor appointments
  getDoctorAppointments: async () => {
    try {
      const response = await API.get('/doctor-dashboard/appointments');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId, statusData) => {
    try {
      const response = await API.put(`/doctor-dashboard/appointments/${appointmentId}`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create bill for patient
  createBill: async (billData) => {
    try {
      const response = await API.post('/doctor-dashboard/bills', billData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
