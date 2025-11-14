import React, { useState } from 'react'
import { useEffect } from 'react';

const RoutesDashboard = ({ filteredRoutes }) => {
    const [expandedRouteId, setExpandedRouteId] = useState(null);
    return (
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                    <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                            <th className="px-4 py-3">Route Number</th>
                            <th className="px-4 py-3">Stops</th>
                            <th className="px-4 py-3">Assigned Bus</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>


                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                        {filteredRoutes.length > 0 ? (
                            filteredRoutes.map((route) => (
                                <tr key={route._id} className="text-gray-700 dark:text-gray-400">
                                    <td className="px-4 py-3 text-sm font-semibold">{route.routeNo}</td>
                                    <td className="px-4 py-3 text-sm relative">
                                        <div className="flex flex-wrap gap-2">
                                            {route.stops.slice(0, 4).map((stop, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs 
                           text-gray-800 dark:text-gray-200 font-medium shadow-sm"
                                                >
                                                    {stop}
                                                </div>
                                            ))}

                                            {route.stops.length > 4 && (
                                                <button
                                                    onClick={() =>
                                                        setExpandedRouteId(
                                                            expandedRouteId === route._id ? null : route._id
                                                        )
                                                    }
                                                    className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300
                           px-2 py-1 rounded-full text-xs font-semibold cursor-pointer"
                                                >
                                                    +{route.stops.length - 4} more
                                                </button>
                                            )}
                                        </div>

                                        {expandedRouteId === route._id && (
                                            <div className="absolute top-full left-0 mt-2 w-64 p-3 rounded-lg bg-white 
                            dark:bg-gray-900 shadow-xl border dark:border-gray-700 z-20">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                                                        All Stops
                                                    </div>

                                                    <button
                                                        onClick={() => setExpandedRouteId(null)}
                                                        className="text-sm text-red-600 dark:text-red-400 cursor-pointer"
                                                    >
                                                        Close
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {route.stops.map((stop, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-xs 
                               text-gray-800 dark:text-gray-200 font-medium shadow-sm"
                                                        >
                                                            {stop}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-sm">
                                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold shadow-sm">
                                            {route.busNo == -1 ? "Unassigned" : `🚌${route.busNo}`}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <button
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg 
                         bg-blue-100 text-blue-700 hover:bg-blue-200 
                         dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 
                         transition font-semibold shadow-sm cursor-pointer"
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
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                    No routes added yet. Click "Add a new route" to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RoutesDashboard