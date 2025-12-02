import axios from 'axios';
import { useState } from 'react';
import server from '../utils/backendServer';
import formatUpdateTime from '../utils/formatUpdateTime';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

export default function RoutesDashboard({ filteredRoutes, setRoutesDataChanged, availableBuses, setBusDataChanged }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [expandedRouteId, setExpandedRouteId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);

    const handleEditClick = (route) => {
        setEditingId(route._id);
        setEditData({
            routeNo: route.routeNo,
            stops: Array.isArray(route.stops) ? [...route.stops] : [],
            busNo: route.bus?.busNo === undefined || route.bus === null ? -1 : route.bus.busNo,
            busId: route.bus != null ? route.bus._id : null
        });
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddStop = (value) => {
        if (!value.trim()) return;
        setEditData(prev => ({ ...prev, stops: [...(prev.stops || []), value.trim()] }));
    };

    const handleRemoveStop = (idx) => {
        setEditData(prev => ({ ...prev, stops: prev.stops.filter((_, i) => i !== idx) }));
    };

    const openDeleteModal = (route) => {
        setSelectedRoute(route);
        setConfirmOpen(true);
    };

    const handleSave = async (originalRoute) => {
        try {
            const payload = {
                originalBusId: originalRoute.bus?._id || null,
                routeNo: editData.routeNo,
                stops: editData.stops || [],
                bus: editData.busId || null,
            };

            const response = await axios.patch(
                `${server}/routes/updateRouteAndBus/${originalRoute._id}`,
                payload
            );
            if (response.status === 200) {
                if ((originalRoute.bus?._id || null) !== editData.busId) {
                    setBusDataChanged(true);
                }
                setEditingId(null);
                setEditData({});
                setRoutesDataChanged(true);
                toast.success(`Route no ${editData.routeNo} edited successfully`)
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update route. Try again.');
        }
    };

    // Cancel edit
    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    // Delete route
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${server}/routes/deleteRoute/${selectedRoute._id}`, { data: { busId: selectedRoute.bus?._id || null } });
            if (response.status === 200) {
                setRoutesDataChanged(true);
                if (selectedRoute.bus !== null) {
                    setBusDataChanged(true);
                }
                setConfirmOpen(false)
                toast.success(`Route no ${selectedRoute.routeNo} deleted successfully`)
                setSelectedRoute(null)
            }
        } catch (error) {
            toast.error('Failed to delete route.');
            console.error(error);
        }
    };



    return (
        <>
            <div className="w-full rounded-lg shadow-xs overflow-x-scroll">

                <div className={`${filteredRoutes.length < 5 ? 'h-[30vh]' : ''}`}>
                    <table className="min-w-max sm:w-full table-auto whitespace-no-wrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th className="px-4 py-3">Route</th>
                                <th className="px-4 py-3">Stops</th>
                                <th className="px-4 py-3">Assigned Bus</th>
                                <th className="px-4 py-3">Last Update</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {filteredRoutes && filteredRoutes.length > 0 ? (
                                filteredRoutes.map((route, index) => {
                                    const isLastRows = (filteredRoutes.length > 4 && index >= filteredRoutes.length - 4);

                                    return (
                                        <tr key={route._id} className="text-gray-700 dark:text-gray-400">
                                            {editingId === route._id ? (
                                                <>
                                                    <td className="px-4 max-w-20 py-3">
                                                        <input
                                                            type="text"
                                                            value={editData.routeNo || ''}
                                                            onChange={e => handleInputChange('routeNo', e.target.value)}
                                                            className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm font-semibold"
                                                        />
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <input
                                                                type="text"
                                                                placeholder="Add a stop and press Enter"
                                                                className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm mb-2"
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                                        handleAddStop(e.target.value);
                                                                        e.target.value = '';
                                                                    }
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex flex-wrap max-w-125 gap-2">
                                                            {(editData.stops || []).map((stop, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-xs text-gray-800 dark:text-gray-200 font-medium shadow-sm relative group"
                                                                >
                                                                    {stop}
                                                                    <button
                                                                        onClick={() => handleRemoveStop(idx)}
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs font-bold"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3 text-sm">
                                                        <select
                                                            className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm font-semibold"
                                                            value={editData.busNo}
                                                            onChange={e => {
                                                                const val = e.target.value;
                                                                if (val === 'inactive') {
                                                                    handleInputChange('busNo', -1);
                                                                    handleInputChange('busId', null);
                                                                } else {
                                                                    const busObj = availableBuses.find(
                                                                        b => String(b.busNo) === val || b.busNo === val
                                                                    );
                                                                    if (busObj) {
                                                                        handleInputChange('busNo', busObj.busNo);
                                                                        handleInputChange('busId', busObj._id);
                                                                    } else {
                                                                        handleInputChange('busNo', val);
                                                                        handleInputChange('busId', null);
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <option value="">Select Bus</option>
                                                            {availableBuses.map(bus => (
                                                                <option key={bus.busNo} value={bus.busNo}>
                                                                    BUS {bus.busNo}
                                                                </option>
                                                            ))}
                                                            <option value={-1}>Unassigned</option>
                                                        </select>
                                                    </td>

                                                    <td className="px-4 py-3 text-sm">{formatUpdateTime(route.updatedAt)}</td>

                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition font-semibold shadow-sm cursor-pointer"
                                                                onClick={() => handleSave(route)}
                                                            >
                                                                Save
                                                            </button>

                                                            <button
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition font-semibold shadow-sm cursor-pointer"
                                                                onClick={handleCancel}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-4 py-3 text-sm font-semibold">{route.routeNo}</td>

                                                    <td className="px-4 py-3 text-sm relative">
                                                        <div className="flex flex-wrap gap-2">
                                                            {route.stops.slice(0, 3).map((stop, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-md text-xs text-gray-800 dark:text-gray-200 font-medium shadow-sm"
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
                                                                    className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold cursor-pointer"
                                                                >
                                                                    +{route.stops.length - 3} more
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Popup */}
                                                        {expandedRouteId === route._id && (
                                                            <div
                                                                className={`
                                            absolute left-0 z-20 transition-all duration-200
                                            ${isLastRows ? "-top-33 left-32" : "top-10"}
                                        `}
                                                            >
                                                                <div
                                                                    className={`${route.stops.length > 7 ? "w-96" : "w-64"
                                                                        } p-3 rounded-lg bg-white dark:bg-gray-900 shadow-xl border dark:border-gray-700`}
                                                                >
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
                                                                                className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-xs text-gray-800 dark:text-gray-200 font-medium shadow-sm"
                                                                            >
                                                                                {stop}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold shadow-sm">
                                                            {route.bus === null ? "Unassigned" : `BUS ${route.bus.busNo}`}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3 text-sm">{formatUpdateTime(route.updatedAt)}</td>

                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition font-semibold shadow-sm cursor-pointer"
                                                                onClick={() => handleEditClick(route)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition font-semibold shadow-sm cursor-pointer"
                                                                onClick={() => openDeleteModal(route)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No routes added yet. Click "Add a new route" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            <ConfirmModal
                open={confirmOpen}
                title={`Delete Route no ${selectedRoute?.routeNo}?`}
                message={`Are you sure you want to delete Route no ${selectedRoute?.routeNo}? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
            />

        </>
    );
}
