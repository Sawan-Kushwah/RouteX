import { useState } from 'react'
import axios from 'axios'
import server from '../utils/backendServer'
import SuccessModal from '../components/SuccessModal'


export default function DriverDashboard({ filteredDrivers, setDriverDataChanged }) {
    // drivers and setDrivers are expected to be provided by AdminDashboard
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
    const [deletedDriver, setDeletedDriver] = useState(null)

    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState({})


    const handleDelete = async (driverId) => {
        if (!window.confirm('Are you sure you want to delete this driver?')) return
        try {
            const response = await axios.delete(`${server}/driver/deleteDriver/${driverId}`)
            if (response.status === 200) {
                setDeletedDriver(response.data.driver)
                setShowDeleteSuccess(true)
                setDriverDataChanged(true)
            }
        } catch (error) {
            console.error('Error deleting driver:', error)
            alert('Failed to delete driver')
        }
    }

    const handleEditClick = (driver) => {
        setEditingId(driver._id)
        setEditData({ email: driver.email, firstName: driver.firstName || '', lastName: driver.lastName || '' })
    }

    const handleInputChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }))
    }

    const handleSaveEdit = async (driverId) => {
        try {
            const response = await axios.put(`${server}/driver/updateDriver/${driverId}`, {
                email: editData.email,
                firstName: editData.firstName,
                lastName: editData.lastName
            })
            if (response.status === 200) {
                setDriverDataChanged(true);
                setEditingId(null)
                setEditData({})
            }
        } catch (error) {
            console.error('Error updating driver:', error)
            alert('Failed to update driver')
        }
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditData({})
    }



    return (
        <div className="h-full overflow-y-auto bg-gray-900">
            <div className="container mx-auto grid">
                <div className="w-full overflow-hidden rounded-lg shadow-xs">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full whitespace-no-wrap">
                            <thead>
                                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                    <th className="px-4 py-3">First Name</th>
                                    <th className="px-4 py-3">Last Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                {filteredDrivers.length > 0 ? (
                                    filteredDrivers.map((driver) => (
                                        <tr key={driver._id} className="text-gray-700 dark:text-gray-400">
                                            <td className="px-4 py-3 text-sm">
                                                {editingId === driver._id ? (
                                                    <input
                                                        type="text"
                                                        value={editData.firstName}
                                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                        className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                    />
                                                ) : (
                                                    driver.firstName || ''
                                                )}
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                {editingId === driver._id ? (
                                                    <input
                                                        type="text"
                                                        value={editData.lastName}
                                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                        className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                    />
                                                ) : (
                                                    driver.lastName || ''
                                                )}
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                {editingId === driver._id ? (
                                                    <input
                                                        type="email"
                                                        value={editData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                    />
                                                ) : (
                                                    driver.email
                                                )}
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    {editingId === driver._id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleSaveEdit(driver._id)}
                                                                className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs font-semibold"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditClick(driver)}
                                                                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(driver._id)}
                                                                className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold"
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
                                            No drivers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <SuccessModal
                visible={showDeleteSuccess}
                heading="Driver Deleted Successfully!"
                details={deletedDriver}
                onClose={() => setShowDeleteSuccess(false)}
                buttonText="Done"
                autoClose={true}
                autoCloseDelay={3000}
            />
        </div>
    )
}
