import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['consultation', 'procedure', 'test', 'treatment', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', ServiceSchema);
export default Service;
