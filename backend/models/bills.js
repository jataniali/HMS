import mongoose from "mongoose";


const BillsSchema= new mongoose.Schema({
patient:{type:mongoose.Schema.Types.ObjectId, ref:'Patient',required:true},
 appointment: {type: mongoose.Schema.Types.ObjectId,ref: "Appointment",default: null
  },
 items: [
{
name: { type: String, required: true },
price: { type: Number, required: true }}
  ],
total: {
type: Number,
},
status: {
    type: String,
    enum: ["pending", "paid", "canceled"],
    default: "pending"
  }
},{timestamps:true})

BillsSchema.pre('save', function(next){
if(this.items && this.items.length>0){
    this.total=this.items.reduce((sum,item)=>sum + item.price,0)
}
next()
})


const Bills=mongoose.model('Bills',BillsSchema);
export default Bills