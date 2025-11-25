import { useState } from 'react'
import axios from 'axios'
import server from '../utils/backendServer';
import SuccessModal from '../components/SuccessModal';
import formatUpdateTime from '../utils/formatUpdateTime';

export default function BusDashboard({ filteredBuses, setBusDataChanged, setRoutesDataChanged }) {
    const [showSuccess, setShowSuccess] = useState(false)
    const [deletedBus, setDeletedBus] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState({})
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
    const [updatedBus, setUpdatedBus] = useState(null)

    const handleDelete = async (bus) => {
        if (bus.status === 'active') {
            alert('You cannot delete a active bus')
            return
        }
        const response = await axios.delete(`${server}/bus/deleteBus/${bus._id}`)
        console.log('deleting bus:', bus._id, response)
        if (response.status === 200) {
            setDeletedBus(response.data.bus)
            setShowSuccess(true)
            setBusDataChanged(true);
            console.log('bus deleted successfully', response.data.bus)
        } else {
            alert('Failed to delete bus')
        }
    }

    const handleEditClick = (bus) => {
        setEditingId(bus._id)
        setEditData({
            busNo: bus.busNo,
            numberPlate: bus.numberPlate,
            status: bus.status
        })
    }

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async (bus) => {
        try {
            // console.log(busId , editData);
            if (bus.status === 'active' && editData.status === 'maintenance') {
                if (!confirm('Your bus is active on route , bus will get removed from routes')) {
                    return;
                }
            }
            const response = await axios.patch(`${server}/bus/updateBus/${bus._id}`, {
                busNo: editData.busNo,
                numberPlate: editData.numberPlate.toLowerCase(),
                status: editData.status.toLowerCase(),
                originalStatus: bus.status
            })

            if (response.status === 200) {
                if (editData.status.toLowerCase() !== bus.status) {
                    setRoutesDataChanged(true);
                }
                setUpdatedBus(response.data.bus)
                setShowUpdateSuccess(true)
                setEditingId(null)
                setEditData({})
                setBusDataChanged(true);
            }
        } catch (error) {
            alert('Failed to update bus. Please try again.')
            console.error(error)
        }
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditData({})
    }

    const handleSuccessClose = () => {
        setShowSuccess(false)
        setDeletedBus(null)
    }

    const handleUpdateSuccessClose = () => {
        setShowUpdateSuccess(false)
        setUpdatedBus(null)
    }



    return (
        <div>
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
                <div className="w-full overflow-x-auto">
                    <table className="w-full whitespace-no-wrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th className="px-4 py-3">Bus Number</th>
                                <th className="px-4 py-3">Number Plate</th>
                                <th className="px-4 py-3">Last Update</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">

                            {filteredBuses.length > 0 ? (filteredBuses.map((bus) => (
                                <tr key={bus._id} className="text-gray-700 dark:text-gray-400">
                                    <td className="px-4 py-3 text-sm font-semibold">
                                        {editingId === bus._id ? (
                                            <input
                                                type="text"
                                                value={editData.busNo}
                                                onChange={(e) => handleInputChange('busNo', e.target.value)}
                                                className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                            />
                                        ) : (
                                            `BUS = ${bus.busNo}`
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {editingId === bus._id ? (
                                            <input
                                                type="text"
                                                value={editData.numberPlate.toUpperCase()}
                                                onChange={(e) => handleInputChange('numberPlate', e.target.value)}
                                                className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                            />
                                        ) : (
                                            bus.numberPlate.toUpperCase() || '-'
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {formatUpdateTime(bus.updatedAt)}
                                    </td>
                                    <td className="px-4 py-3 text-xs">
                                        {editingId === bus._id ? (
                                            <select
                                                value={editData.status}
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                                className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                            >
                                                {editData.status === 'active' && <option value="active">Active</option>}
                                                {editData.status === 'inactive' && <option value="inactive">Inactive</option>}
                                                {editData.status === 'maintenance' && <option value="inactive">Inactive</option>}
                                                <option value="maintenance">maintenance</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-2 py-1 font-semibold leading-tight rounded-full ${bus.status === 'active'
                                                    ? ('text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100')
                                                    : (bus.status === 'inactive' ? 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100' : 'text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100')
                                                    }`}
                                            >
                                                {bus.status === 'active' ? 'Active on Route' : bus.status === 'inactive' ? 'Inactive on Route' : 'Maintanence'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            {editingId === bus._id ? (
                                                <>
                                                    <button
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg 
                         bg-green-100 text-green-700 hover:bg-green-200 
                         dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 
                         transition font-semibold shadow-sm cursor-pointer"
                                                        onClick={() => handleSave(bus)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                                d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Save
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg 
                         bg-gray-100 text-gray-700 hover:bg-gray-200 
                         dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 
                         transition font-semibold shadow-sm cursor-pointer"
                                                        onClick={() => handleCancel()}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                                d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg 
                         bg-blue-100 text-blue-700 hover:bg-blue-200 
                         dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 
                         transition font-semibold shadow-sm cursor-pointer"
                                                        onClick={() => handleEditClick(bus)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                                d="M11 5h2m-1-1v2m-4 6l6-6m-6 6V5m6 6h-6M4 20h16" />
                                                        </svg>
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg 
                         bg-red-100 text-red-700 hover:bg-red-200 
                         dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 
                         transition font-semibold shadow-sm cursor-pointer"
                                                        onClick={() => handleDelete(bus)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                                d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
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
                                        No bus added yet. Click "Add a new bus" to get started.
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <SuccessModal
                visible={showSuccess}
                heading="Bus Deleted Successfully!"
                details={deletedBus}
                onClose={handleSuccessClose}
                buttonText="Done"
                autoClose={true}
                autoCloseDelay={3000}
            />

            <SuccessModal
                visible={showUpdateSuccess}
                heading="Bus Updated Successfully!"
                details={updatedBus}
                onClose={handleUpdateSuccessClose}
                buttonText="Done"
                autoClose={true}
                autoCloseDelay={3000}
            />
        </div>
    )
}