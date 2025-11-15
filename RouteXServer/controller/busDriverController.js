import BusDriver from '../models/busDriverModel.js';
import Driver from '../models/busDriverModel.js';
import bcrypt from 'bcrypt';

const addDriver = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const existingDriver = await Driver.findOne({ email });

        if (existingDriver) {
            return res.status(400).json({ message: "Driver with the same email already exists" });
        }

        bcrypt.genSalt(10, async (err, salt) => {
            if (err) {
                return res.status(500).json({ message: "Error generating salt", error: err.message });
            }
            bcrypt.hash(password, salt, async (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ message: "Error hashing password", error: err.message });
                }
                const newDriver = new Driver({ firstName, lastName, email, password: hashedPassword });
                await newDriver.save();
                res.status(200).json({ message: "Driver added successfully", driver: newDriver });
            });
        });

    } catch (error) {
        res.status(500).json({ message: "Error adding driver", error: error.message });
    }
};

const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.status(200).json({ drivers: drivers.map(driver => ({ _id: driver._id, email: driver.email, firstName: driver.firstName, lastName: driver.lastName })) });
    } catch (error) {
        res.status(500).json({ message: "Error fetching drivers", error: error.message });
    }
};


const updateDriver = async (req, res) => {
    try {
        const driverId = req.params.id;
        const updates = req.body;
        const updatedDriver = await BusDriver.findByIdAndUpdate(driverId, updates, { new: true });

        if (!updatedDriver) {
            return res.status(404).json({ message: "Bus not found" });
        }

        res.status(200).json({ message: "Bus updated successfully", bus: updatedDriver });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating bus", error: error.message });
    }
}

const deleteDriver = async (req, res) => {
    try {
        const id = req.params.id;
        const driver = await Driver.findByIdAndDelete(id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }
        res.status(200).json({ message: "Driver deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting driver", error: error.message });
    }
};


export default { addDriver, getAllDrivers, updateDriver, deleteDriver };
