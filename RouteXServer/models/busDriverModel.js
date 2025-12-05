import mongoose from "mongoose";

const busDriverSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    licenseValidity: {
        type: Date,
        require: true
    }
}, { timestamps: true });

const BusDriver = mongoose.model('BusDriver', busDriverSchema);
export default BusDriver;
