import mongoose from "mongoose";
const busSchema = new mongoose.Schema({
    busNo: { type: String, required: true },
    numberPlate: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' }
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);
export default Bus; 