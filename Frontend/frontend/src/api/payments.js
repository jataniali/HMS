import API from './axios';

export const paymentAPI = {
  // Initiate M-Pesa payment
  initiateMpesaPayment: async (paymentData) => {
    try {
      const response = await API.post('/payments/mpesa/initiate', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    try {
      const response = await API.get(`/payments/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get patient payments
  getPatientPayments: async (patientId) => {
    try {
      const response = await API.get(`/payments/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check payment status
  checkPaymentStatus: async (paymentId) => {
    try {
      const response = await API.get(`/payments/status/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default paymentAPI;
