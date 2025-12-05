import mongoose from "mongoose";
const busSchema = new mongoose.Schema({
    busNo: { type: Number, required: true },
    numberPlate: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'inactive' },
    pucExp: {
        type: Date,
        require: true
    },
    fittnessExp: {
        type: Date,
        require: true
    },
    roadTaxExp: {
        type: Date,
        require: true
    }, 
    permitExp: {
        type: Date,
        require: true
    }

}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);
export default Bus; 