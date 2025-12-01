import axios from 'axios';
import React, { useState } from 'react'
import server from '../utils/backendServer';
export default function RouteForm({ onClose, setRoutesDataChanged, availableBuses = [], setBusDataChanged }) {
    const [routeName, setRouteNumber] = useState('')
    const [stops, setStops] = useState([])
    const [stopInput, setStopInput] = useState('')
    const [selectedBusId, setSelectedBusId] = useState(null)


    const handleAddStop = (e) => {
        if (e.key === 'Enter' && stopInput.trim()) {
            e.preventDefault()
            setStops([...stops, stopInput.trim()])
            setStopInput('')
        }
    }

    const handleRemoveStop = (index) => {
        setStops(stops.filter((_, i) => i !== index))
    }

    const handleSuccessClose = () => {
        setRouteNumber(0)
        if (typeof onClose === 'function') onClose()
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (routeName.trim() && stops.length > 0) {

                const response = await axios.post(`${server}/routes/addRoute`, {
                    routeNo: routeName,
                    stops: stops,
                    bus: selectedBusId !== null ? selectedBusId : null
                });
                console.log(response);

                if (response.status == 201 || response.status == 200) {
                    setRoutesDataChanged(true);
                    if (selectedBusId) {
                        setBusDataChanged(true);
                    }
                    setRouteNumber('')
                    setStops([])
                    setStopInput('')
                    setSelectedBusId(null)
                }
            } else {
                alert('Please enter a route name and at least one stop')
            }
        } catch (error) {
            console.error("Error adding route:", error);
            alert('Failed to add route. Please try again. route might already exist.')
        }


    }

    return (
        <>

            <div className="fixed inset-0 bg-[#000000c9] flex items-center justify-center z-50 sm:p-4 p-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                  w-full sm:w-3/4 md:w-1/2 
                  max-h-[90vh] overflow-y-auto 
                  p-6 sm:p-8">

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                            Add New Route
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Route Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Route Number
                            </label>
                            <input
                                type="text"
                                value={routeName}
                                onChange={(e) => setRouteNumber(e.target.value)}
                                placeholder="e.g., Route 101"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Stops Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Stops (Press Enter to add)
                            </label>
                            <input
                                type="text"
                                value={stopInput}
                                onChange={(e) => setStopInput(e.target.value.toUpperCase())}
                                onKeyPress={handleAddStop}
                                placeholder="Enter stop name and press Enter"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Stops List */}
                        {stops.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Added Stops:</p>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {stops.map((stop, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-purple-100 dark:bg-purple-900 p-3 rounded-md"
                                        >
                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {index + 1}. {stop}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveStop(index)}
                                                className="text-red-600 hover:text-red-800 cursor-pointer text-xl dark:hover:text-red-400 font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bus Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Assign Bus (Optional)
                            </label>
                            <select
                                value={selectedBusId || ''}
                                onChange={(e) => {
                                    if (e.target.value === '') {
                                        setSelectedBusId(null);
                                    } else {
                                        const busObj = availableBuses.find(b => b._id === e.target.value);
                                        if (busObj) {
                                            setSelectedBusId(busObj._id);
                                        }
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">-- No Bus Available --</option>
                                {availableBuses && availableBuses.length > 0 ? (
                                    availableBuses.map(bus => (
                                        <option key={bus._id} value={bus._id}>
                                            BUS {bus.busNo}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No bus available</option>
                                )}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 cursor-pointer bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 cursor-pointer bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                Add Route
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
