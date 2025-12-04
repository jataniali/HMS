import Payment from "../models/payment.js";
import Bills from "../models/bills.js";
import axios from "axios";

console.log('PaymentController module loaded');

class PaymentController {
  // M-Pesa Daraja API configuration
  static getMpesaConfig() {
    return {
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET,
      shortcode: process.env.MPESA_SHORTCODE,
      passkey: process.env.MPESA_PASSKEY,
      environment: process.env.MPESA_ENVIRONMENT || "sandbox", // sandbox or production
      callbackUrl: process.env.MPESA_CALLBACK_URL || "https://your-domain.com/api/payments/callback"
    };
  }

  // Get M-Pesa access token
  static async getMpesaAccessToken() {
    try {
      const config = PaymentController.getMpesaConfig();
      const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
      
      const response = await axios.get(
        config.environment === "production" 
          ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
          : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error("Error getting M-Pesa access token:", error);
      throw new Error("Failed to get M-Pesa access token");
    }
  }

  // Initiate M-Pesa STK Push
  static async initiateMpesaPayment(req, res) {
    try {
      console.log('M-Pesa payment request received:', req.body);
      const { billId, patientId, phone, amount } = req.body;

      // Validate required fields
      if (!billId || !patientId || !phone || !amount) {
        return res.status(400).json({ 
          message: "Bill ID, patient ID, phone, and amount are required" 
        });
      }

      // Validate phone number format (should start with 254...)
      if (!phone.startsWith("254") || phone.length !== 12) {
        return res.status(400).json({ 
          message: "Phone number must be in format 254XXXXXXXXX" 
        });
      }

      // Check if bill exists and belongs to patient
      const bill = await Bills.findById(billId).populate('appointment');
      if (!bill) {
        return res.status(404).json({ message: "Bill not found" });
      }

      // Create payment record
      const payment = new Payment({
        bill: billId,
        patient: patientId,
        amount: amount,
        phone: phone,
        mpesaPhoneNumber: phone,
        paymentStatus: "pending",
        paymentMethod: "mpesa"
      });

      await payment.save();

      // Get M-Pesa access token
      const accessToken = await PaymentController.getMpesaAccessToken();
      const config = PaymentController.getMpesaConfig();

      // Generate timestamp and password
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, -4);
      const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString("base64");

      // Prepare STK Push request
      const stkPushRequest = {
        BusinessShortCode: config.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: config.shortcode,
        PhoneNumber: phone,
        CallBackURL: config.callbackUrl,
        AccountReference: `BILL-${billId}`,
        TransactionDesc: `Payment for bill ${billId}`,
      };

      console.log("Initiating M-Pesa STK Push:", stkPushRequest);

      // Send STK Push request
      const response = await axios.post(
        config.environment === "production"
          ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
          : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        stkPushRequest,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update payment with M-Pesa response
      payment.merchantRequestId = response.data.MerchantRequestID;
      payment.checkoutRequestId = response.data.CheckoutRequestID;
      payment.responseCode = response.data.ResponseCode;
      payment.responseDescription = response.data.ResponseDescription;
      payment.customerMessage = response.data.CustomerMessage;
      
      await payment.save();

      console.log("M-Pesa STK Push response:", response.data);

      res.status(200).json({
        message: "M-Pesa payment initiated successfully",
        payment: payment,
        mpesaResponse: response.data,
      });

    } catch (error) {
      console.error("Error initiating M-Pesa payment:", error);
      res.status(500).json({ 
        message: "Failed to initiate M-Pesa payment",
        error: error.message 
      });
    }
  }

  // M-Pesa callback handler
  static async handleMpesaCallback(req, res) {
    try {
      console.log("M-Pesa callback received:", req.body);

      const { Body } = req.body;
      const { stkCallback } = Body;

      if (stkCallback.ResultCode === 0) {
        // Payment successful
        const { 
          MerchantRequestID, 
          CheckoutRequestID,
          ResultDesc,
          CallbackMetadata 
        } = stkCallback;

        // Extract payment details
        const mpesaReceipt = CallbackMetadata.Item.find(item => item.Name === "MpesaReceiptNumber")?.Value;
        const phoneNumber = CallbackMetadata.Item.find(item => item.Name === "PhoneNumber")?.Value;
        const transactionAmount = CallbackMetadata.Item.find(item => item.Name === "Amount")?.Value;
        const transactionDate = CallbackMetadata.Item.find(item => item.Name === "TransactionDate")?.Value;

        // Find and update payment
        const payment = await Payment.findOne({
          merchantRequestId: MerchantRequestID,
          checkoutRequestId: CheckoutRequestID,
        });

        if (payment) {
          payment.paymentStatus = "completed";
          payment.mpesaTransactionId = mpesaReceipt;
          payment.mpesaReceiptNumber = mpesaReceipt;
          payment.mpesaPhoneNumber = phoneNumber;
          payment.transactionDate = new Date();
          payment.responseDescription = ResultDesc;
          
          await payment.save();

          // Update bill status to paid
          await Bills.findByIdAndUpdate(payment.bill, { status: "paid" });

          console.log("Payment completed successfully:", payment);
        }
      } else {
        // Payment failed
        const { MerchantRequestID, CheckoutRequestID, ResultDesc } = stkCallback;

        const payment = await Payment.findOne({
          merchantRequestId: MerchantRequestID,
          checkoutRequestId: CheckoutRequestID,
        });

        if (payment) {
          payment.paymentStatus = "failed";
          payment.responseDescription = ResultDesc;
          await payment.save();
        }

        console.log("Payment failed:", ResultDesc);
      }

      res.status(200).json({ message: "Callback processed successfully" });

    } catch (error) {
      console.error("Error processing M-Pesa callback:", error);
      res.status(500).json({ message: "Failed to process callback" });
    }
  }

  // Get payment by ID
  static async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id)
        .populate('bill')
        .populate('patient', 'name email phone');

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.status(200).json({ payment });

    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ message: "Failed to fetch payment" });
    }
  }

  // Get payments for a patient
  static async getPatientPayments(req, res) {
    try {
      const { patientId } = req.params;
      const payments = await Payment.find({ patient: patientId })
        .populate('bill')
        .sort({ createdAt: -1 });

      res.status(200).json({ payments });

    } catch (error) {
      console.error("Error fetching patient payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  }

  // Check payment status
  static async checkPaymentStatus(req, res) {
    try {
      const { paymentId } = req.params;
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.status(200).json({
        paymentId: payment._id,
        status: payment.paymentStatus,
        mpesaReceiptNumber: payment.mpesaReceiptNumber,
        amount: payment.amount,
        transactionDate: payment.transactionDate
      });

    } catch (error) {
      console.error("Error checking payment status:", error);
      res.status(500).json({ message: "Failed to check payment status" });
    }
  }
}

export default PaymentController;