import BusRoute from "../models/busRouteModel.js";
import Bus from "../models/busModel.js";
import mongoose from "mongoose";

const getAllRoutes = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const routes = await BusRoute.find({}).sort({ routeNo: 1 }).populate({ path: "bus", select: "busNo" })
        const inactiveBuses = await Bus.find({ status: 'inactive' }).sort({ busNo: 1 }).select("_id busNo");
        let routeHaveBus = 0;
        routes.forEach((route) => {
            if (route.bus) {
                routeHaveBus++;
            }
        })

        await session.commitTransaction();
        if (!routes) {
            return res.status(500).json({ message: "Error fetching routes", error: err.message });
        } else {
            return res.status(200).json({ message: "Fetched all routes successfully", routes, inactiveBuses, routeHaveBus });
        }
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error fetching routes", error: error.message });
    } finally {
        session.endSession();
    }
}


const addRoute = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { routeNo, bus, stops } = req.body;
        const existingRoute = await BusRoute.findOne({ routeNo });
        if (existingRoute) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Route no exits" });
        }
        const newRoute = new BusRoute({ routeNo, bus, stops });
        const savedRoute = await newRoute.save();
        const populatedRoute = await BusRoute.findById(savedRoute._id).populate({ path: "bus", select: "busNo" });

        // If a bus is assigned, update its status to active
        if (bus) {
            await Bus.findByIdAndUpdate(
                bus,
                { status: "active" }
            );
        }
        await session.commitTransaction();
        res.status(200).json({ message: "Route added successfully", route: populatedRoute });
    }
    catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error adding route", error: error.message });
    } finally {
        session.endSession();
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
    const session = await mongoose.startSession();
    session.startTransaction();
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
                    { status: "inactive" }
                );
            }

            // Assign new bus
            if (newBusId) {
                await Bus.findByIdAndUpdate(
                    newBusId,
                    { status: "active" }
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
            await session.abortTransaction();
            return res.status(404).json({
                message: "Route not found"
            });
        }
        await session.commitTransaction();
        res.status(200).json({
            message: "Route updated successfully",
            route: updatedRoute
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error updating route:", error);
        res.status(500).json({
            message: "Error updating route",
            error: error.message
        });
    } finally {
        session.endSession();
    }
};


const deleteRoute = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const routeId = req.params.id;
        const { busId } = req.body;

        if (busId !== null) {
            await Bus.findByIdAndUpdate(busId, { status: 'inactive' })
        }

        const deletedRoute = await BusRoute.findByIdAndDelete(routeId);
        if (!deletedRoute) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Route not found" });
        }
        await session.commitTransaction();
        res.status(200).json({ message: "Route deleted successfully", route: deletedRoute });
    }
    catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Error deleting route", error: error.message });
    } finally {
        select.endSession();
    }
}

const getRouteById = async (req, res) => {
    try {
        const routeId = req.params.id;
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
        const { q, limit = 5 } = req.query;

        if (!q || q.trim() === "") {
            return res.status(200).json({ message: "Empty search query", routes: [] });
        }

        const searchQuery = q.trim();
        const isNumber = !isNaN(searchQuery);
        const numValue = Number(searchQuery);
        const searchRegex = new RegExp(searchQuery, "i");
        const selectRouteField = "stops routeNo updatedAt";
        const selectBusField = "busNo numberPlate status";

        let populateOptions = {
            path: "bus",
            select: selectBusField
        };


        let findQuery = {
            $or: [{ stops: { $in: [searchRegex] } }]
        };

        if (isNumber) {
            findQuery.$or.push({ routeNo: numValue });
        }

        // Get routes + bus (no filtering yet)
        let routes = await BusRoute.find(findQuery)
            .select(selectRouteField)
            .populate(populateOptions)
            .limit(limit);


        res.status(200).json({
            message: "Search completed successfully",
            routes
        });

    } catch (error) {
        console.error("Error searching routes:", error);
        res.status(500).json({ message: "Error searching routes", error: error.message });
    }
};



const getAllAssignedRoutes = async (req, res) => {
    try {
        const routes = await BusRoute.find({
            bus: { $type: "objectId" }
        }).populate({ path: "bus", select: "busNo" });

        if (!routes) {
            return res.status(404).json({ message: "Route not found" });
        }
        res.status(200).json({ message: "Fetched all assigned successfully", routes });
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
    getAllAssignedRoutes,
    updateRouteAndBus,
    searchRoutes
};