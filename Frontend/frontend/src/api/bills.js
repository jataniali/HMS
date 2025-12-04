import API from './axios';

export const billsAPI = {
  // Create a new bill
  createBill: async (billData) => {
    try {
      const response = await API.post('/bills', billData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all bills for the logged-in patient
  getPatientBills: async (patientId) => {
    try {
      const response = await API.get(`/bills/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all bills (admin only)
  getAllBills: async () => {
    try {
      const response = await API.get('/bills');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a bill
  updateBill: async (billId, updates) => {
    try {
      const response = await API.put(`/bills/${billId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a bill
  deleteBill: async (billId) => {
    try {
      const response = await API.delete(`/bills/${billId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
