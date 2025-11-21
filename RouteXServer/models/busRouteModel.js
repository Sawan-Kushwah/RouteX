import mongoose from "mongoose";

const busRouteSchema = new mongoose.Schema({
    routeNo: { type: Number, required: true, unique: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
    stops: [{ type: String, required: true }],
}, { timestamps: true });

const BusRoute = mongoose.model('BusRoute', busRouteSchema);
export default BusRoute;