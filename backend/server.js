import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/authroutes.js";
import connectdb from "./config/db.js";
import cors from "cors";
import patientroutes from './routes/patientroutes.js'
import doctorroute from './routes/doctorroute.js'
import doctorroutedashboard from './routes/doctordashboardroute.js'
import appointmentroute from './routes/appointmentroute.js'
import billroute from './routes/billroute.js'
import uploadroute from './routes/uploadroute.js'
import serviceroute from './routes/serviceroute.js'
import paymentroute from './routes/paymentroute.js'
dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.get('/',(req,res)=>{
res.send('hello dev')
})

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Add your frontend URL(s) here
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true, // Enable if you're using cookies/sessions
  exposedHeaders: ['x-auth-token'], // Add this line to expose x-auth-token header
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS to all routes
app.use(cors(corsOptions));

app.use('/api/auth',authroutes)
app.use('/api/patients',patientroutes);
app.use('/api/doctors',doctorroute);
app.use('/api/doctor-dashboard', doctorroutedashboard);
app.use('/api/appointments',appointmentroute);
app.use('/api/bills',billroute)
app.use('/api/uploads',uploadroute)
app.use('/api/services',serviceroute)
app.use('/api/payments',paymentroute)

connectdb();
app.listen(PORT,()=>{
console.log(`Your server is running on http://localhost:${PORT}`);
})