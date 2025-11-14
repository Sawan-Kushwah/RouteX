import React, { useEffect, useState } from 'react'
import BusForm from './BusForm'

export default function BusDashboard({ filteredBuses }) {



    return (

        <div>


            {
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

                                {filteredBuses.map((bus) => (
                                    <tr key={bus._id} className="text-gray-700 dark:text-gray-400">
                                        <td className="px-4 py-3 text-sm font-semibold">{bus.busNo}</td>
                                        <td className="px-4 py-3 text-sm">{bus.numberPlate || '-'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {bus.updatedAt
                                                ? new Date(bus.updatedAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            <span
                                                className={`px-2 py-1 font-semibold leading-tight rounded-full ${bus.status === 'active'
                                                    ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100'
                                                    : 'text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100'
                                                    }`}
                                            >
                                                {bus.status}
                                            </span>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            }
        </div>

    )
}