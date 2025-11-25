import BusRoute from "../models/busRouteModel.js";
import Bus from "../models/busModel.js";

const getAllRoutes = async (req, res) => {
    try {
        const routes = await BusRoute.find({}).populate({ path: "bus", select: "busNo" })
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
        const routes = await BusRoute.find({ bus: { $ne: null } }).populate({ path: "bus", select: "busNo" });
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
        const { routeNo, bus, stops } = req.body;
        const newRoute = new BusRoute({ routeNo, bus, stops });
        const savedRoute = await newRoute.save();
        const populatedRoute = await BusRoute.findById(savedRoute._id).populate({ path: "bus", select: "busNo" });

        // If a bus is assigned, update its status to assigned
        if (bus) {
            await Bus.findByIdAndUpdate(
                bus,
                { status: "assigned" }
            );
        }

        console.log("Saved Route:", populatedRoute);
        res.status(200).json({ message: "Route added successfully", route: populatedRoute });
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
            bus
        } = req.body;

        const oldBusId = originalBusId || null;
        const newBusId = bus || null;

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
                bus: newBusId
            },
            { new: true }
        ).populate({ path: "bus", select: "busNo" });

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
            await Bus.findByIdAndUpdate(busId, { status: 'unassigned' })
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
        const route = await BusRoute.findById(routeId).populate({ path: "bus", select: "busNo" });
        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }
        res.status(200).json({ message: "Fetched route successfully", route });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching route", error: error.message });
    }
}

const searchRoutes = async (req, res) => {
    try {
        const { q  , limit } = req.query;
        const fields = ["stops","busNo","routeNo"]
        console.log(fields)

        const busFields =  fields.filter(f =>( f == "busNo" || f == 'numberPlate' || f == 'status'))
        const selectBusField = busFields.join(" ")
        const routeFields = fields.filter(f => f != "busNo" && f != 'numberPlate' &&  f != 'status')
        const selectRouteField = routeFields.join(" ")
        
        if (!q || q.trim() === '') {
            return res.status(200).json({ message: "Empty search query", routes: [] });
        }

        const searchQuery = q.trim();
        const routeNo = (!isNaN(searchQuery)) ? Number(searchQuery) : -1; 
        const searchRegex = new RegExp(searchQuery, 'i');
        
        // Search in route number, stops, or bus number
        // give search result as select stops busno initially bs 5 dena baki search ke according 
        const routes = await BusRoute.find({
            $or: [
                { routeNo: routeNo },
                { stops: { $in: [searchRegex] } }
            ]
        })
        .select(selectRouteField)
        .populate({ path: "bus", select: selectBusField })
        .limit(limit);

        console.log("respons => ", routes)

        res.status(200).json({ 
            message: "Search completed successfully", 
            routes: routes 
        });
    } catch (error) {
        console.error("Error searching routes:", error);
        res.status(500).json({ message: "Error searching routes", error: error.message });
    }
}

export default {
    getAllRoutes,
    addRoute,
    updateRoute,
    deleteRoute,
    getRouteById,
    updateRouteAndBus,
    getAllAssignedRoutes,
    searchRoutes
};