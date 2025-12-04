import mongoose from "mongoose";

const PaymentSchema= new mongoose.Schema({
bill:{
type: mongoose.Schema.Types.ObjectId,
ref:"Bills",
required:true
},
patient:{
type: mongoose.Schema.Types.ObjectId,
ref:"Patient",
required: true,
},
amount:{
type:Number,
required: true,
},
phone:{
type:String,
required: true,
},
// M-Pesa specific fields
mpesaTransactionId:{
type: String,
unique: true,
sparse: true // Allows null values but ensures uniqueness when present
},
mpesaReceiptNumber:{
type: String,
sparse: true
},
mpesaPhoneNumber:{
type: String,
required: true
},
paymentStatus:{
type: String,
enum: ['pending', 'completed', 'failed', 'cancelled'],
default: 'pending'
},
paymentMethod:{
type: String,
enum: ['mpesa', 'cash', 'card'],
default: 'mpesa'
},
transactionDate:{
type: Date,
default: Date.now
},
merchantRequestId:{
type: String,
sparse: true
},
checkoutRequestId:{
type: String,
sparse: true
},
responseCode:{
type: String,
sparse: true
},
responseDescription:{
type: String,
sparse: true
},
customerMessage:{
type: String,
sparse: true
}

},{timestamps:true})

const Payment= mongoose.model('Payment',PaymentSchema);
export default Payment;