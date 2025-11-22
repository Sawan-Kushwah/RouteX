import mongoose from "mongoose";
import Bus from "../models/busModel.js";
import BusRoute from "../models/busRouteModel.js";

const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find({});
        let activeBusCount = 0;
        let inactiveBusCount = 0;
        let maintenanceBusCount = 0;
        buses.forEach((bus) => {
            if (bus.status === 'active') activeBusCount++;
            else if (bus.status === 'inactive') inactiveBusCount++;
            else if (bus.status === 'maintenance') maintenanceBusCount++;
        });

        if (!buses) {
            return res.status(500).json({ message: "Error fetching buses", error: err.message });
        }
        res.status(200).json({ message: "Fetched all buses successfully", buses, activeBusCount, inactiveBusCount, maintenanceBusCount });
    } catch (error) {
        res.status(500).json({ message: "Error fetching buses", error: error.message });
    }
}

const addBus = async (req, res) => {
    try {
        const { busNo, numberPlate, status } = req.body;
        const existingBus = await Bus.findOne({ $or: [{ busNo }, { numberPlate }] });
        if (existingBus) {
            return res.status(400).json({ message: "Bus with the same number or plate already exists" });
        }
        const newBus = new Bus({ busNo, numberPlate, status });
        await newBus.save();
        res.status(200).json({ message: "Bus added successfully", bus: newBus });
    }
    catch (error) {
        res.status(500).json({ message: "Error adding bus", error: error.message });
    }
}

const updateBus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const busId = req.params.id;
        const updates = req.body;

        if (updates.originalStatus === 'active' && updates.status === 'maintenance') {
            await BusRoute.findOneAndUpdate({ bus: busId }, { bus: null })
        }

        await Bus.findByIdAndUpdate(busId, updates, { new: true });
        session.commitTransaction();
        res.status(200).json({ message: "Bus updated successfully" });
    }
    catch (error) {
        session.abortTransaction();
        res.status(500).json({ message: "Error updating bus", error: error.message });
    } finally {
        session.endSession();
    }
}

const deleteBus = async (req, res) => {
    try {
        const busId = req.params.id;
        const deletedBus = await Bus.findByIdAndDelete(busId);
        if (!deletedBus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        res.status(200).json({ message: "Bus deleted successfully", bus: deletedBus });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting bus", error: error.message });
    }
}

const getBusById = async (req, res) => {
    try {
        const busId = req.params.id;
        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        res.status(200).json({ message: "Bus fetched successfully", bus });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching bus", error: error.message });
    }
}

export default {
    getAllBuses,
    addBus,
    updateBus,
    deleteBus,
    getBusById
};