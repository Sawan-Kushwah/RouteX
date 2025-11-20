import BusRoute from "../models/busRouteModel.js";
import Bus from "../models/busModel.js";

const getAllRoutes = async (req, res) => {
    try {
        const routes = await BusRoute.find({});
        const unassignedBus = await Bus.find({ status: 'unassigned' }).select("_id busNo");
        if (!routes) {
            return res.status(500).json({ message: "Error fetching routes", error: err.message });
        } else {
            return res.status(200).json({ message: "Fetched all routes successfully", routes, unassignedBus });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching routes", error: error.message });
    }
}
const getAllAssignedRoutes = async (req, res) => {
    try {
        const routes = await BusRoute.find({ busId: { $ne: null } });
        if (!routes) {
            return res.status(500).json({ message: "Error fetching routes", error: err.message });
        } else {
            return res.status(200).json({ message: "Fetched all assigned routes successfully", routes });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching routes", error: error.message });
    }
}


const addRoute = async (req, res) => {
    try {
        const { routeNo, busId, busNo, stops } = req.body;
        const newRoute = new BusRoute({ routeNo, busId, busNo, stops });
        const savedRoute = await newRoute.save();

        // If a bus is assigned, update its status to assigned
        if (busId) {
            await Bus.findByIdAndUpdate(
                busId,
                { status: "assigned" }
            );
        }

        console.log("Saved Route:", savedRoute);
        res.status(200).json({ message: "Route added successfully", route: savedRoute });
    }
    catch (error) {
        console.error("Error adding route:", error);
        res.status(500).json({ message: "Error adding route", error: error.message });
    }
}
const updateRoute = async (req, res) => {
    try {
        const routeId = req.params.id;
        const updates = req.body;
        updates.busNo = updates.busNo === 'Unassigned' ? -1 : Number(updates.busNo);
        updates.routeNo = Number(updates.routeNo);

        const updatedRoute = await BusRoute.findByIdAndUpdate(routeId, updates, { new: true });
        if (!updatedRoute) {
            return res.status(404).json({ message: "Route not found" });
        }
        res.status(200).json({ message: "Route updated successfully", route: updatedRoute });
    }
    catch (error) {
        console.error("Error updating route:", error);
        res.status(500).json({ message: "Error updating route", error: error.message });
    }
}

export const updateRouteAndBus = async (req, res) => {
    try {
        const routeId = req.params.id;
        const {
            originalBusId,
            routeNo,
            stops,
            busNo,
            busId
        } = req.body;

        const oldBusId = originalBusId || null;
        const newBusId = busId || null;

        const busChanged = String(oldBusId) !== String(newBusId);

        // 1. Handle bus status changes
        if (busChanged) {

            // Unassign previous bus
            if (oldBusId) {
                await Bus.findByIdAndUpdate(
                    oldBusId,
                    { status: "unassigned" }
                );
            }

            // Assign new bus
            if (newBusId) {
                await Bus.findByIdAndUpdate(
                    newBusId,
                    { status: "assigned" }
                );
            }
        }

        // 2. Update the route
        const updatedRoute = await BusRoute.findByIdAndUpdate(
            routeId,
            {
                routeNo: Number(routeNo),
                stops: stops || [],
                busNo: busNo ? Number(busNo) : null,
                busId: newBusId
            },
            { new: true }
        );

        if (!updatedRoute) {
            return res.status(404).json({
                message: "Route not found"
            });
        }

        res.status(200).json({
            message: "Route updated successfully",
            route: updatedRoute
        });

    } catch (error) {
        console.error("Error updating route:", error);
        res.status(500).json({
            message: "Error updating route",
            error: error.message
        });
    }
};



const deleteRoute = async (req, res) => {
    try {
        const routeId = req.params.id;
        const { busId } = req.body;

        if (busId !== null) {
            Bus.findByIdAndUpdate(busId, { status: 'unassigned' })
        }

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
    getRouteById,
    updateRouteAndBus,
    getAllAssignedRoutes
};