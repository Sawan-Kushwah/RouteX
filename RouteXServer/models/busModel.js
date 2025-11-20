import mongoose from "mongoose";
const busSchema = new mongoose.Schema({
    busNo: { type: Number, required: true },
    numberPlate: { type: String, required: true },
    status: { type: String, enum: ['assigned', 'unassigned', 'maintenance'], default: 'unassigned' }
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);
export default Bus; 