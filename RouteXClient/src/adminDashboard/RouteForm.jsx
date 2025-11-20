import axios from 'axios';
import React, { useState } from 'react'
import SuccessModal from '../components/SuccessModal';
export default function RouteForm({ onClose, onAddRoute }) {
    const [routeName, setRouteNumber] = useState('')
    const [stops, setStops] = useState([])
    const [stopInput, setStopInput] = useState('')
    const [showSuccess, setShowSuccess] = useState(false);
    const [addedRoute, setAddedRoute] = useState([]);

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
        setShowSuccess(false)
        setAddedRoute([])
        setRouteNumber(0)
        if (typeof onClose === 'function') onClose()
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (routeName.trim() && stops.length > 0) {

                const response = await axios.post('http://localhost:3000/routes/addRoute', {
                    routeNo: routeName,
                    stops: stops,
                    busNo: -1,
                    busId: null
                });
                // console.log("Response from adding route:", response);
                // console.log("Response status", response.status);

                if (response.status == 201 || response.status == 200) {
                    setAddedRoute(response.data.route);
                    onAddRoute(true);
                    // console.log("Route added:", response.data.route);
                    setShowSuccess(true);
                    // onAddRoute({ routeNo: routeName, stops: stops });
                    setRouteNumber('')
                    setStops([])
                    setStopInput('')
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

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-1/2 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Add New Route</h2>
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
                                onChange={(e) => setStopInput(e.target.value)}
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

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 cursor-pointer bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                Add Route
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 cursor-pointer bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <SuccessModal
                visible={showSuccess}
                heading="Route Added Successfully!"
                details={addedRoute}
                onClose={handleSuccessClose}
                buttonText="Done"
                autoClose={true}
                autoCloseDelay={3000}
            />
        </>
    )
}
