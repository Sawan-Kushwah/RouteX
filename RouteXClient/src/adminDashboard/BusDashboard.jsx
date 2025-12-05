import { useState } from 'react'
import axios from 'axios'
import server from '../utils/backendServer';
import { formatLicenseValidity } from '../utils/formatUpdateTime';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';
export default function BusDashboard({ filteredBuses, setBusDataChanged, setRoutesDataChanged }) {
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState({})
    const [editingOrignalState, setEditingOrignalState] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);

    const handleDelete = async () => {
        if (selectedBus.status === 'active') {
            toast.warning('You cannot delete a active bus')
            return
        }
        const response = await axios.delete(`${server}/bus/deleteBus/${selectedBus._id}`)
        if (response.status === 200) {
            toast.success(`Bus No ${selectedBus.busNo} deleted successfully`)
            setBusDataChanged(true);
            setConfirmOpen(false)
            selectedBus(null)
        } else {
            toast.error('Failed to delete bus')
        }
    }

    const handleEditClick = (bus) => {
        setEditingId(bus._id)
        setEditingOrignalState(bus.status)
        setEditData({
            busNo: bus.busNo,
            numberPlate: bus.numberPlate,
            status: bus.status,
            pucExp: bus.pucExp,
            fittnessExp: bus.fittnessExp,
            roadTaxExp: bus.roadTaxExp,
            permitExp: bus.permitExp
        })
    }

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        try {
            const response = await axios.patch(`${server}/bus/updateBus/${editingId}`, {
                busNo: editData.busNo,
                numberPlate: editData.numberPlate.toLowerCase(),
                status: editData.status.toLowerCase(),
                pucExp: editData.pucExp,
                fittnessExp: editData.fittnessExp,
                roadTaxExp: editData.roadTaxExp,
                permitExp: editData.permitExp,
                originalStatus: editingOrignalState
            })

            if (response.status === 200) {
                toast.success(`Bus no ${editData.busNo} updated successfully`)
                if (editData.status.toLowerCase() !== editingOrignalState) {
                    setRoutesDataChanged(true);
                }
                setEditingId(null)
                setEditingOrignalState("");
                setEditData({})
                setBusDataChanged(true);
            }
        } catch (error) {
            toast.error('Failed to update bus. Please try again.')
            console.error(error)

        }
    }



    const handleCancel = () => {
        setEditingId(null)
        setEditingOrignalState("")
        setEditData({})
    }

    const openDeleteModal = (bus) => {
        setSelectedBus(bus);
        setConfirmOpen(true);
    };



    return (
        <>
            <div className="w-full rounded-lg shadow-xs overflow-x-scroll">
                <div className={`${filteredBuses.length < 5 ? 'h-[30vh]' : ''}`}>
                    <table className="min-w-max sm:w-full table-auto whitespace-nowrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th className="px-3 py-2 sm:px-4 sm:py-3">Bus Number</th>
                                <th className="px-3 py-2 sm:px-4 sm:py-3">Number Plate</th>
                                <th className="px-3 py-2 sm:px-4 sm:py-3">Status</th>
                                <th className="px-3 py-2 sm:px-4 sm:py-3">PUC Expiry</th>
                                <th className="px-3 py-2 sm:px-4 sm:py-3">Tax Expiry</th>
                                <th className="px-3 py-2 sm:px-4 sm:py-3">Fittness Expiry</th>
                                <th className="px-3 py-2 sm:px-4 sm:py-3">Permit</th>
                                <th className="px-3 py-2 sm:px-4 sm:py-3">Last Update</th>
                                <th className="px-3 py-2 sm:px-4 sm:py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {filteredBuses.length > 0 ? (
                                filteredBuses.map((bus) => (
                                    <tr key={bus._id} className="text-gray-700 dark:text-gray-400 text-sm">

                                        {/* BUS NUMBER */}
                                        <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold">
                                            {editingId === bus._id ? (
                                                <input
                                                    type="text"
                                                    value={editData.busNo}
                                                    onChange={(e) => handleInputChange('busNo', e.target.value)}
                                                    className="w-15 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                />
                                            ) : (
                                                `BUS - ${bus.busNo}`
                                            )}
                                        </td>

                                        {/* NUMBER PLATE */}
                                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                                            {editingId === bus._id ? (
                                                <input
                                                    type="text"
                                                    value={editData.numberPlate.toUpperCase()}
                                                    onChange={(e) => handleInputChange('numberPlate', e.target.value)}
                                                    className="w-28 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                />
                                            ) : (
                                                bus.numberPlate.toUpperCase()
                                            )}
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs">
                                            {editingId === bus._id ? (
                                                <select
                                                    value={editData.status}
                                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                >
                                                    <option value="inactive">Inactive</option>
                                                    <option value="maintenance">Maintenance</option>
                                                </select>
                                            ) : (
                                                <span
                                                    className={`px-2 py-1 rounded-full font-semibold leading-tight
                      ${bus.status === 'active'
                                                            ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100'
                                                            : bus.status === 'inactive'
                                                                ? 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100'
                                                                : 'text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100'
                                                        }`}
                                                >
                                                    {bus.status === 'active'
                                                        ? 'Active'
                                                        : bus.status === 'inactive'
                                                            ? 'Inactive'
                                                            : 'Maintenance'}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                                            {
                                                editingId == bus._id ? (

                                                    <div className="flex flex-col gap-1">
                                                        <label className="font-medium">{"PUC expiry"}</label>

                                                        <input
                                                            type="date"
                                                            value={bus.pucExp}
                                                            onChange={(e) => handleInputChange("pucExp", e.target.value)}
                                                            className="border w-28 p-2 rounded-md"
                                                        />
                                                    </div>

                                                )
                                                    : !bus.pucExp ?   "Not Updated" 
                                                    : 
                                                    
                                                    formatLicenseValidity(bus.pucExp) 
                                            }
                                            
                                        </td>
                                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                                            {
                                                editingId == bus._id ? (

                                                    <div className="flex flex-col gap-1">
                                                        <label className="font-medium">{"Rode Tax expiry"}</label>

                                                        <input
                                                            type="date"
                                                            value={bus.pucExp}
                                                            onChange={(e) => handleInputChange("roadTaxExp", e.target.value)}
                                                            className="border w-28 p-2 rounded-md"
                                                        />
                                                    </div>

                                                )
                                                    : bus.roadTaxExp ? formatLicenseValidity(bus.roadTaxExp) : "Not Updated"
                                            }

                                        </td>
                                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                                            {
                                                editingId == bus._id ? (

                                                    <div className="flex flex-col gap-1">
                                                        <label className="font-medium">{"Fittness expiry"}</label>

                                                        <input
                                                            type="date"
                                                            value={bus.fittnessExp}
                                                            onChange={(e) => handleInputChange("fittnessExp", e.target.value)}
                                                            className="border w-28 p-2 rounded-md"
                                                        />
                                                    </div>

                                                )
                                                    : bus.fittnessExp ? formatLicenseValidity(bus.fittnessExp) : "Not Updated"
                                            }

                                        </td>
                                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                                            {
                                                editingId == bus._id ? (

                                                    <div className="flex flex-col gap-1">
                                                        <label className="font-medium">{"Permit expiry"}</label>

                                                        <input
                                                            type="date"
                                                            value={bus.permitExp}
                                                            onChange={(e) => handleInputChange("permitExp", e.target.value)}
                                                            className="border w-28 p-2 rounded-md"
                                                        />
                                                    </div>

                                                )
                                                    : bus.fittnessExp ? formatLicenseValidity(bus.permitExp) : "Not Updated"
                                            }

                                        </td>

                                        {/* LAST UPDATE */}
                                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                                            {formatLicenseValidity(bus.updatedAt)}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-3 py-2 sm:px-4 sm:py-3">
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">

                                                {/* EDITING MODE BUTTONS */}
                                                {editingId === bus._id ? (
                                                    <>
                                                        <button
                                                            className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shadow-sm"
                                                            onClick={handleSave}
                                                        >
                                                            Save
                                                        </button>

                                                        <button
                                                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 shadow-sm"
                                                            onClick={handleCancel}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm"
                                                            onClick={() => handleEditClick(bus)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 shadow-sm"
                                                            onClick={() => openDeleteModal(bus)}
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
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No bus added yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            <ConfirmModal
                open={confirmOpen}
                title={`Delete Bus no ${selectedBus?.busNo}?`}
                message={`Are you sure you want to delete bus no ${selectedBus?.busNo}? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    )
}