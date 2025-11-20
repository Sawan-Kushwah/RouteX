import mongoose from "mongoose";

const busRouteSchema = new mongoose.Schema({
    routeNo: { type: Number, required: true, unique: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
    busNo: { type: Number, default: -1 },
    stops: [{ type: String, required: true }],
}, { timestamps: true });

const BusRoute = mongoose.model('BusRoute', busRouteSchema);
export default BusRoute;