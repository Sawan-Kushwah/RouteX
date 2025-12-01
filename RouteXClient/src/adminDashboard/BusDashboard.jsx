import { useState } from 'react'
import axios from 'axios'
import server from '../utils/backendServer';
import formatUpdateTime from '../utils/formatUpdateTime';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/ConfirmDialog';

export default function BusDashboard({ filteredBuses, setBusDataChanged, setRoutesDataChanged }) {

    const [deletedBus, setDeletedBus] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState({})
    const [editingOrignalState, setEditingOrignalState] = useState("");
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
    const [updatedBus, setUpdatedBus] = useState(null)

    const [open, setOpen] = useState(false);


    const handleDelete = async (bus) => {
        if (bus.status === 'active') {
            // alert('You cannot delete a active bus')
            toast.warning('You cannot delete a active bus')
            return
        }
        const response = await axios.delete(`${server}/bus/deleteBus/${bus._id}`)
        console.log('deleting bus:', bus._id, response)
        if (response.status === 200) {
            setDeletedBus(response.data.bus)
            setBusDataChanged(true);
            console.log('bus deleted successfully', response.data.bus)
            toast.success("Bus deletd successfully")
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
            status: bus.status
        })
    }

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const saveState = async () => {
        try {
             const response = await axios.patch(`${server}/bus/updateBus/${editingId}`, {
                    busNo: editData.busNo,
                    numberPlate: editData.numberPlate.toLowerCase(),
                    status: editData.status.toLowerCase(),
                    originalStatus: editingOrignalState
                })

                if (response.status === 200) {
                    if (editData.status.toLowerCase() !== editingOrignalState) {
                        setRoutesDataChanged(true);
                    }
                    setUpdatedBus(response.data.bus)
                    setShowUpdateSuccess(true)
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

    const handleSave = async (bus) => {
            // console.log(busId , editData);
            if (bus.status === 'active' && editData.status === 'maintenance') {
                setOpen(true);
            } else {
                saveState()
            }
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditingOrignalState("")
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
        <div className="w-full rounded-lg shadow-xs overflow-x-scroll">
            <ConfirmDialog
                open={open}
                title="Delete Bus?"
                message="Are you sure you want to delete this bus? This action cannot be undone."
                onConfirm={() => {
                    saveState()
                    setOpen(false)
                }}
                onCancel={() => { setOpen(false) }}
            />
            <div className={`${filteredBuses.length < 5 ? 'h-[30vh]' : ''}`}>
                <table className="min-w-max sm:w-full table-auto whitespace-nowrap">
                    <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                            <th className="px-3 py-2 sm:px-4 sm:py-3">Bus Number</th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3">Number Plate</th>
                            <th className="px-3 py-2 sm:px-4 sm:py-3">Status</th>
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
                                                className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
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
                                                className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
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
                                                className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                            >
                                                <option value="active">Active</option>
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
                                                    }
                    `}
                                            >
                                                {bus.status === 'active'
                                                    ? 'Active'
                                                    : bus.status === 'inactive'
                                                        ? 'Inactive'
                                                        : 'Maintenance'}
                                            </span>
                                        )}
                                    </td>

                                    {/* LAST UPDATE */}
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">
                                        {formatUpdateTime(bus.updatedAt)}
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">

                                            {/* EDITING MODE BUTTONS */}
                                            {editingId === bus._id ? (
                                                <>
                                                    <button
                                                        className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shadow-sm"
                                                        onClick={() => handleSave(bus)}
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
                                                        onClick={() => handleDelete(bus)}
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

    )
}