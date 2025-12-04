import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";
import Appointment from "../models/appointment.js";
import Bills from "../models/bills.js";

class doctordashboardcontroller{


    // get doctor profile
static async getDoctorProfile(req,res){
try {
// req.user store the decoded token info
const userId=req.user.id
// find doctor by userId
const doctor= await Doctor.findOne({userId})
if(!doctor){
return res.status(404).json({message:"Doctor profile not found"});
}
return res.status(200).json({doctor});
} 
catch (error) {
 res.status(500).json({ message: error.message });
}
}

// update doctor profile
static async updateDoctorProfile(req,res){
try {
 const userId= req.user.id  

const updates=req.body;
const updatedoctor=await Doctor.findOneAndUpdate({userId},
updates,
{new:true,runValidators:true}
)
if(!updatedoctor){
return res.status(404).json({message:"Doctor profile not found"});
}
return res.status(200).json({message:"Doctor profile updated successfully",
doctor:updatedoctor});
} 
catch (error) {
res.status(500).json({ message: error.message });
}
}

//get patient assigned to this doctor 
static async getassignedPatients(req,res){
try {
const doctor =await Doctor.findOne({userId:req.user.id})
if(!doctor){
return res.status(404).json({message:"Doctor profile not found"});
}
const appointments= await Appointment.find({doctor:doctor._id}).populate('patient'); 
const patients = [...new Map(appointments.map(a => [a.patient?._id?.toString(), a.patient])).values()];

return res.status(200).json({patients}) ;
} 
catch (error) {
 res.status(500).json({ message: error.message });
}
}

// get doctor appointments
static async getDoctorAppointments(req,res){
try {
const doctor =await Doctor.findOne({userId:req.user.id})
if(!doctor){
return res.status(404).json({message:"Doctor profile not found"});
}

console.log('Fetching appointments for doctor:', doctor._id);

const appointments= await Appointment.find({doctor:doctor._id})
.populate('patient')
.sort({date:1})

console.log('Found appointments:', appointments.length);

// Log appointment details for debugging
appointments.forEach((apt, index) => {
  console.log(`Appointment ${index + 1}:`, {
    id: apt._id,
    patientId: apt.patient?._id || apt.patient,
    patientData: apt.patient,
    date: apt.date,
    status: apt.status
  });
});

// Also log if we can find the patient directly
for (const apt of appointments) {
  if (apt.patient && typeof apt.patient === 'object') {
    console.log('Patient populated successfully:', {
      id: apt.patient._id,
      name: apt.patient.name,
      email: apt.patient.email
    });
  } else if (apt.patient) {
    // Try to find patient manually
    try {
      const patient = await Patient.findById(apt.patient);
      console.log('Manual patient lookup:', patient);
    } catch (err) {
      console.log('Error finding patient:', err.message);
    }
  }
}

// If appointments have no patients, create meaningful dummy patient data
const appointmentsWithPatients = appointments.map(apt => {
  if (!apt.patient) {
    // Create a dummy patient object with appointment-specific info
    apt.patient = {
      _id: null,
      name: `Appointment #${apt._id.toString().slice(-6)}`,
      firstName: 'Patient',
      lastName: `#${apt._id.toString().slice(-6)}`,
      email: `patient-${apt._id.toString().slice(-6)}@example.com`,
      phone: 'Not provided'
    };
  }
  return apt;
});

return res.status(200).json({appointments: appointmentsWithPatients});
} 
catch (error) {
 console.error('Error fetching appointments:', error);
 res.status(500).json({ message: error.message });  
}
}

// update appointment status
static async updateAppointmentStatus(req,res){
try {
 const appointmentId= req.params.id;
const doctor = await Doctor.findOne({userId:req.user.id})
if(!doctor){
return res.status(404).json({message:"Doctor profile not found"});
}

console.log('Updating appointment:', appointmentId);
console.log('Doctor ID:', doctor._id);
console.log('Request body:', req.body);

// First check if appointment exists
const existingAppointment = await Appointment.findOne({_id:appointmentId});
console.log('Existing appointment:', existingAppointment);

const appointment= await Appointment.findOneAndUpdate(
{_id:appointmentId,doctor:doctor._id}
,req.body,
{new:true,runValidators:true})
if(!appointment){
return res.status(404).json({message:"Appointment not found or not assigned to this doctor"});
}
return res.status(200).json({message:"Appointment status updated successfully",
appointment});
} 
catch (error) {
console.error('Error updating appointment:', error);
res.status(500).json({ message: error.message }); 
}
}

// create bill for patient
static async createBill(req,res){
try {
 const doctor = await Doctor.findOne({userId:req.user.id})
 if(!doctor){
 return res.status(404).json({message:"Doctor profile not found"});
 }
 
 const {patientId, appointmentId, items} = req.body;
 if(!appointmentId || !items || items.length ===0){
 return res.status(400).json({message:"Appointment and items are required"});
 }
 
 // Verify the appointment belongs to this doctor
 const appointment = await Appointment.findOne({_id: appointmentId, doctor: doctor._id});
 if(!appointment){
 return res.status(404).json({message:"Appointment not found or not assigned to you"});
 }
 
 // Use the actual patient from the appointment
 const finalPatientId = appointment.patient || appointmentId;
 
 const newBill = new Bills({
 patient: finalPatientId,
 appointment: appointmentId,
 items: items
 })
 
 await newBill.save()
 return res.status(201).json({message:"Bill created successfully", bill:newBill})
} 
catch (error) {
 console.error('Error creating bill:', error);
 res.status(500).json({ message: error.message });
}
}

}
export default doctordashboardcontroller;