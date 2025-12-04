import express from "express";
import paymentController from "../controllers/paymentcontroller.js";
import { verifytoken, verifyrole } from '../middlewares/authmidlware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifytoken);

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Payment routes working!' });
});

console.log('Payment controller loaded successfully');

// Payment routes
router.post('/mpesa/initiate', paymentController.initiateMpesaPayment);
router.post('/mpesa/callback', paymentController.handleMpesaCallback);
router.get('/payment/:id', paymentController.getPaymentById);
router.get('/patient/:patientId', verifyrole('patient', 'admin'), paymentController.getPatientPayments);
router.get('/status/:paymentId', paymentController.checkPaymentStatus);

export default router;
