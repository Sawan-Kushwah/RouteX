import { useState } from "react";
import axios from "axios";
import server from "../utils/backendServer";
import {formatUpdateTime , formatLicenseValidity} from "../utils/formatUpdateTime";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

export default function DriverDashboard({ filteredDrivers, setDriverDataChanged }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${server}/driver/deleteDriver/${selectedDriver._id}`);
            if (response.status === 200) {
                setDriverDataChanged(true);
                toast.success(`${selectedDriver.firstName + " " + selectedDriver.lastName} Deleted successfully`)
                setSelectedDriver(null);
                setConfirmOpen(false)
            }
        } catch (error) {
            console.error("Error deleting driver:", error);
            toast.error("Failed to delete driver");
        }
    };

    const handleEditClick = (driver) => {
        setEditingId(driver._id);
        setEditData({
            firstName: driver.firstName,
            lastName: driver.lastName,
            email: driver.email,
            licenseValidity: driver.licenseValidity
        });
    };

    const handleInputChange = (field, value) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveEdit = async (driverId) => {
        try {
            const emailPattern =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!emailPattern.test(editData.email)) {
                toast.warning("Invalid email input");
                return;
            }

            const response = await axios.put(
                `${server}/driver/updateDriver/${driverId}`,
                {
                    firstName: editData.firstName,
                    lastName: editData.lastName,
                    email: editData.email,
                    licenseValidity: editData.licenseValidity
                }
            );

            if (response.status === 200) {
                toast.success("Driver updated successfully");
                setDriverDataChanged(true);
                setEditingId(null);
                setEditData({});
            }
        } catch (error) {
            console.error("Error updating driver:", error);
            toast.error("Failed to update driver");
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const openDeleteModal = (driver) => {
        setSelectedDriver(driver);
        setConfirmOpen(true);
    };


    return (
        <>
            <div className="h-full overflow-y-auto bg-gray-900">
                <div className="container mx-auto grid">
                    <div className="w-full overflow-hidden rounded-lg shadow-xs">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full whitespace-no-wrap">
                                <thead>
                                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">License Validity</th>
                                        <th className="px-4 py-3">Last Update</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                    {filteredDrivers.length > 0 ? (
                                        filteredDrivers.map((driver) => (
                                            <tr key={driver._id} className="text-gray-700 dark:text-gray-400">
                                                {/* FIRST NAME */}
                                                <td className="px-4 py-3 text-sm">
                                                    {editingId === driver._id ? (
                                                        <div className="flex justify-between">
                                                            <div className="w-9/20">

                                                                <label >Last name</label>
                                                                <input
                                                                    type="text"
                                                                    value={editData.firstName}
                                                                    onChange={(e) =>
                                                                        handleInputChange("firstName", e.target.value)
                                                                    }
                                                                    className=" w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                                />
                                                            </div>
                                                            <div className="w-9/20">

                                                                <label >Last name</label>
                                                                <input
                                                                    type="text"
                                                                    value={editData.lastName}
                                                                    onChange={(e) =>
                                                                        handleInputChange("lastName", e.target.value)
                                                                    }
                                                                    className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        driver.firstName + " " + driver.lastName
                                                    )}
                                                </td>



                                                {/* EMAIL (Not editable in UI) */}
                                                <td className="px-4 py-3 text-sm">
                                                    {driver.email}
                                                </td>

                                                <td className="px-4 py-3 text-sm">
                                                    {
                                                        editingId == driver._id ? (
                                                            // <input
                                                            // type="date"
                                                            // className=" w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                            // placeholder={ driver.licenseValidity || null}
                                                            // />

                                                            <div className="flex flex-col gap-1">
                                                                <label className="font-medium">{"Date"}</label>

                                                                <input
                                                                    type="date"
                                                                    value={driver.licenseValidity}
                                                                    onChange={(e) => handleInputChange("licenseValidity",e.target.value)}
                                                                    className="border p-2 rounded-md"
                                                                />
                                                            </div>

                                                        )
                                                            : driver.licenseValidity ? formatLicenseValidity(driver.licenseValidity) : "Not Updated"}
                                                </td>

                                                <td className="px-4 py-3 text-sm">
                                                    {formatUpdateTime(driver.updatedAt)}
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {editingId === driver._id ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleSaveEdit(driver._id)}
                                                                    className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shadow-sm"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelEdit}
                                                                    className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 shadow-sm"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEditClick(driver)}
                                                                    className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm"
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    onClick={() => openDeleteModal(driver)}
                                                                    className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 shadow-sm"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                            >
                                                No drivers found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={confirmOpen}
                title={`Delete Bus no ${selectedDriver?.busNo}?`}
                message={`Are you sure you want to delete bus no ${selectedDriver?.busNo}? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}
