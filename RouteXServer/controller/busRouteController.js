import BusRoute from "../models/busRouteModel.js";

const getAllRoutes = async (req, res) => {
    try {
        const routes = await BusRoute.find({})
        if (!routes) {
            return res.status(500).json({ message: "Error fetching routes", error: err.message });
        }
        res.status(200).json({ message: "Fetched all routes successfully", routes });
    } catch (error) {
        res.status(500).json({ message: "Error fetching routes", error: error.message });
    }
}


const addRoute = async (req, res) => {
    try {
        const { routeNo, busId, busNo, stops } = req.body;
        const newRoute = new BusRoute({ routeNo, busId, busNo, stops });
        await newRoute.save();
        res.status(201).json({ message: "Route added successfully", route: newRoute });
    }
    catch (error) {
        res.status(500).json({ message: "Error adding route", error: error.message });
    }
}
const updateRoute = async (req, res) => {
    try {
        const routeId = req.params.id;
        const updates = req.body;
        const updatedRoute = await BusRoute.findByIdAndUpdate(routeId, updates, { new: true });
        if (!updatedRoute) {
            return res.status(404).json({ message: "Route not found" });
        }
        res.status(200).json({ message: "Route updated successfully", route: updatedRoute });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating route", error: error.message });
    }
}
const deleteRoute = async (req, res) => {
    try {
        const routeId = req.params.id;
        const deletedRoute = await BusRoute.findByIdAndDelete(routeId);
        if (!deletedRoute) {
            return res.status(404).json({ message: "Route not found" });
        }
        res.status(200).json({ message: "Route deleted successfully", route: deletedRoute });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting route", error: error.message });
    }
}
const getRouteById = async (req, res) => {
    try {
        const routeId = req.params.id;
        console.log("Route ID:", routeId);
        const route = await BusRoute.findById(routeId);
        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }
        res.status(200).json({ message: "Fetched route successfully", route });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching route", error: error.message });
    }
}
export default {
    getAllRoutes,
    addRoute,
    updateRoute,
    deleteRoute,
    getRouteById
};