import Bus from "../models/busModel.js";

const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find({});
        if (!buses) {
            return res.status(500).json({ message: "Error fetching buses", error: err.message });
        }
        res.status(200).json({ message: "Fetched all buses successfully", buses });
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
        res.status(201).json({ message: "Bus added successfully", bus: newBus });
    }
    catch (error) {
        res.status(500).json({ message: "Error adding bus", error: error.message });
    }
}

const updateBus = async (req, res) => {
    try {
        const busId = req.params.id;
        const updates = req.body;
        const updatedBus = await Bus.findByIdAndUpdate(busId, updates, { new: true });

        if (!updatedBus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        res.status(200).json({ message: "Bus updated successfully", bus: updatedBus });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating bus", error: error.message });
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
        console.log(req.params)
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