// ...existing code...
import axios from 'axios';
import {  useState } from 'react'
import server from '../utils/backendServer';
 
const RoutesDashboard = ({ filteredRoutes , setRoutesDataChanged , busData  }) => {

    const [expandedRouteId, setExpandedRouteId] = useState(null);


    
    console.log(filteredRoutes)
    // single id + single object to manage edit state
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});

    const [routs, setRouts] = useState(filteredRoutes);


    // update route call (uses editingData)
    const handleRouteUpdate = async (routeId) => {
        try {
            // Build payload from editingData
            const payload = {
                routeNo: editingData.routeNo,
                stops: editingData.stops || []
            };

            // busNo: keep -1 for Unassigned
            if (editingData.busId === null || editingData.busId === undefined || editingData.busNo === 'Unassigned' || editingData.busNo === -1) {
                payload.busNo = -1;
                payload.busId = -1;
            } else {
                payload.busNo = editingData.busNo;
                payload.busId = editingData.busId;
            }

            console.log("paylode : ", payload)

            const response = await axios.put(`${server}/routes/updateRoute/${routeId}`, payload);
            if (response.status === 200) {
                const updatedRoute = response.data.route || response.data.updatedRoute || response.data;
                setRouts(prev => prev.map(r => (r._id === routeId ? { ...r, ...updatedRoute } : r)));


                // make a bus update call
                try{
                    if(editingData.busNo && editingData.busNo){
                        const busResponse = await axios.patch(`${server}/bus/updateBus/${editingData.busId}`,{
                            status : "assigned"
                        })

                        if(busResponse.status === 200){
                            console.log("bus status updtated responce : ", busResponse);
                        }

                    }
                }
                catch(error){
                    console.log("error in updating bus state : ",error);
                }
                // clear edit state
                setEditingId(null);
                setEditingData({});
                setRoutesDataChanged(true);
            } else {
                console.error('Failed to update route', response);
            }
        } catch (error) {
            console.error('Error updating route:', error);
        }

        
    };

    const handleEditClick = (route) => {
        // set editing id and initialize editingData with route fields
        setEditingId(route._id);
        setEditingData({
            routeNo: route.routeNo || 0,
            stops: Array.isArray(route.stops) ? [...route.stops] : [],
            busNo: route.busNo === -1 ? 'Unassigned' : route.busNo,
            // try to find busId from busData if present
            busId: route.busId != null ? route.busId :  null ,
            status: route.status
        });
    }

    const handleInputChange = (field, value) => {
        setEditingData(prev => {
            // allow updater function for array fields (e.g., stops)
            if (typeof value === 'function') {
                console.log(field, value)
                const current = prev[field] || [];
                console.log(prev)
                console.log(prev[field])
                console.log(value(current))
                return { ...prev, [field]: value(current) };
            }
            return { ...prev, [field]: value };
        });
    }

    const handleStopUpdate = (value) => {
        console.log(value);
        setEditingData(prev =>{ return  {...prev , ["stops"]: [...prev.stops , value] }})
    }
    
    // handel  delete route
    const handleDelete = async (routeId) => {
        try {
            const responce = await axios.delete(`${server}/routes/deleteRoute/${routeId}`);
            console.log("deletd route : ",responce)
            if(responce.status === 200){
                setRouts(routs.filter((route) => route._id !== routeId));
            }
        } catch (error) {
            console.log("some error occured in deleting route : ", error);
        }
    }
    
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
                        {routs.length > 0 ? (
                            routs.map((route) => {

                            return (editingId !== route._id) ? 
                                <tr key={route._id} className="text-gray-700 dark:text-gray-400">
                                    <td className="px-4 py-3 text-sm font-semibold">{route.routeNo}</td>
                                    <td className="px-4 py-3 text-sm relative">
                                        <div className="flex flex-wrap gap-2">
                                            {route.stops.slice(0, 4).map((stop, idx) => (
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
                                                    +{route.stops.length - 4} more
                                                </button>
                                            )}
                                            
                                        </div>
                                        {expandedRouteId === route._id && (
                                            <div className="absolute top-full left-0 mt-2 w-64 p-3 rounded-lg bg-white dark:bg-gray-900 shadow-xl border dark:border-gray-700 z-20">
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
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold shadow-sm">
                                            {route.busNo == -1 ? "Unassigned" : `BUS ${route.busNo}`}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <button
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition font-semibold shadow-sm cursor-pointer"
                                                onClick={() => handleEditClick(route)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5h2m-1-1v2m-4 6l6-6m-6 6V5m6 6h-6M4 20h16" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button 
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition font-semibold shadow-sm cursor-pointer"
                                            onClick={() => handleDelete(route._id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr> : 
                                <tr key={route._id} className="text-gray-700 dark:text-gray-400">
                                    <td className="px-4 py-3">
                                        <input type="text" name="routeNo" id="routeNo" 
                                        className='px-3 py-1 rounded-md w-25 text-sm font-semibold border-2 border-gray-300'
                                         value={editingData.routeNo || ''} onChange={(e) => handleInputChange('routeNo', e.target.value)} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <input
                                                type="text"
                                                className="px-3 py-1 rounded-md w-64 text-sm font-semibold border-2 border-gray-300 mb-2"
                                                placeholder="Add a stop and press Enter"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                                        console.log(e.target.value)
                                                        // setRouts((prev => {prev.map(r => r._id === route._id ? {...r, stops: [...r.stops , e.target.value.trim()]} : r)}))
                                                        // handleInputChange('stops', prev => [...prev, e.target.value.trim()]);
                                                        handleStopUpdate(e.target.value)
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className='rounded-md flex text-sm font-semibold flex-wrap gap-2'>
                                            {
                                            (editingData.stops || []).map((stop, idx) => (
                                                <div key={idx} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-xs text-gray-800 dark:text-gray-200 font-medium shadow-sm relative group">
                                                    {stop}
                                                    <button
                                                        onClick={() => handleInputChange('stops', prev => prev.filter((_, sIdx) => sIdx !== idx))}
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
                                            className="px-3 py-1 rounded-md text-sm font-semibold border-2 border-gray-300 dark:bg-gray-700 dark:text-gray-200"
                                            value={editingData.busNo }
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === 'Unassigned') {
                                                    handleInputChange('busNo', 'Unassigned');
                                                    handleInputChange('busId', null);
                                                    // preview update
                                                    setRouts(prev => prev.map(r => r._id === route._id ? { ...r, busNo: -1 } : r));
                                                    return;
                                                }
                                                const selectedBus = busData.find((bus) => bus.busNo == val);

                                                if (selectedBus) {                                                    
                                                    handleInputChange('busId', selectedBus._id);
                                                    handleInputChange('busNo', selectedBus.busNo);
                                                    setRouts(prev => prev.map(r => r._id === route._id ? { ...r, busNo: selectedBus.busNo } : r));
                                                } else {
                                                    handleInputChange('busNo', -1);
                                                }
                                            }}
                                        >
                                            <option value="">Select Bus</option>
                                            {
                                                busData.map((bus) => {
                                                    // console.log(bus)
                                                    return ( <option key={bus.busNo} value={bus.busNo}> BUS {bus.busNo}</option>)
                                                })
                                            }
                                            <option value="Unassigned">Unassigned</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <button 
                                            onClick={ () => handleRouteUpdate(editingId) }
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition font-semibold shadow-sm cursor-pointer">
                                                Save
                                            </button>
                                            <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition font-semibold shadow-sm cursor-pointer" onClick={() => { setEditingId(null); setEditingData({}); /* optionally revert preview by refetching or resetting state */ }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </td>
                                </tr>


                            })
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
// ...existing code...