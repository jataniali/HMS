import Bills from "../models/bills.js";

class billcontroller{

// craete bill
static async createBill(req,res){
try {
const {patientId, appointmentId,items}=req.body;
if(!patientId || !items || items.length ===0){
return res.status(400).json({message:"Patient and items are required"});
}
const newBill = new Bills({
patient:patientId,
appointment:appointmentId,
items:items
})
await newBill.save()
return res.status(201).json({message:"Bill created successfully", bill:newBill})
} 
catch (error) {
 res.status(500).json({ message: error.message });
}
}

// get all bills Admin only
static async getAllBills(req,res){
try {
 const bills = await Bills.find()
.populate('patient','name email') 
.populate('appointment','date timeslot') 
.sort({createdAt:-1});
res.status(200).json({bills}) 
} 
catch (error) {
 res.status(500).json({ message: error.message });
}
} 
//  get bills for patient

static async getPatientBils(req,res){
try {
  const patientId=req.params.patientId;
  console.log('Fetching bills for patient:', patientId);
  
  // Find all bills first to see what exists
  const allBills = await Bills.find().populate('appointment','date timeslot patient doctor');
  console.log('All bills in database:', allBills.length);
  allBills.forEach((bill, index) => {
    console.log(`Bill ${index + 1}:`, {
      id: bill._id,
      patient: bill.patient,
      appointment: bill.appointment?._id,
      appointmentPatient: bill.appointment?.patient
    });
  });
  
  // Find bills where patient field matches the patient ID
  // Also find bills created for dummy patients (where appointment ID was used as patient reference)
  const bills= await Bills.find({
    $or: [
      {patient: patientId},
      // Also check if this patient has appointments and find bills for those appointments
      {appointment: {$exists: true}}
    ]
  })  
  .populate('appointment','date timeslot patient doctor')
  .sort({createdAt:-1})
  
  console.log('Bills found with OR query:', bills.length);
  
  // Filter bills to only show those that belong to this patient
  const filteredBills = bills.filter(bill => {
    console.log('Checking bill:', {
      billId: bill._id,
      billPatient: bill.patient,
      patientId: patientId,
      appointmentPatient: bill.appointment?.patient,
      appointmentId: bill.appointment?._id
    });
    
    // Direct patient match
    if (bill.patient?.toString() === patientId) {
      console.log('Direct patient match');
      return true;
    }
    
    // Check if appointment belongs to this patient
    if (bill.appointment?.patient?.toString() === patientId) {
      console.log('Appointment patient match');
      return true;
    }
    
    // For dummy patients, check if the appointment ID matches patient ID (fallback case)
    if (bill.patient?.toString() === bill.appointment?._id?.toString() && 
        bill.patient?.toString() === patientId) {
      console.log('Dummy patient match');
      return true;
    }
    
    return false;
  });
  
  console.log('Filtered bills for patient:', filteredBills.length);
    res.status(200).json({bills: filteredBills})
} 
catch (error) {
    console.error('Error fetching patient bills:', error);
    res.status(500).json({ message: error.message });
}
}

// update bills
static async updateBills(req,res){
try {
const billed= req.params.id
const updates=req.body;

const bill = await Bills.findByIdAndUpdate(billed,updates,
{new:true, runValidators: true}
)
if(!bill){
    return res.status(404).json({message:"Bill not found"})
}
res.status(200).json({bill})
} 
catch (error) {
res.status(500).json({ message: error.message });
}
}

// delete bill

static async deleteBill(req,res){
try {
 const deletebill =req.params.id 
 
 const bill= await Bills.findByIdAndDelete(deletebill)
 if(!bill){
return res.status(404).json({message:"Bill not found"})
 }
    res.status(200).json({message:"Bill deleted successfully"})
} 
catch (error) {
  res.status(500).json({ message: error.message });  
}
}

}
export default billcontroller