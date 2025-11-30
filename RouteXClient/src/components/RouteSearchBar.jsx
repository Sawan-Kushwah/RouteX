import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import server from '../utils/backendServer';
import formatUpdateTime from '../utils/formatUpdateTime';

// async function fetchData(url) {
//     let res = await fetch(url);
//     let data = await res.json();
//     return data;
// }

// function debouncing(func, delay) {
//     let time;
//     return function (...args) {
//         clearTimeout(time);
//         time = setTimeout(() => func(...args), delay);  
//     };
// }

// const inputField = document.getElementById('inputField');  
// const url = "https://api.example.com/search?q='write your query here'"; // Replace with the actual API URL

// inputField.addEventListener('input', debouncing(() => fetchData(url), 1000)); // ✅ 

export default function RouteSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const debounceTimer = useRef(null);

    // Debounced search function
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);

        debounceTimer.current = setTimeout(async () => {
            try {
                const response = await axios.get(`${server}/routes/searchRoutes`, {
                    params: { q: searchQuery , limit : 10 }
                });

                if (response.status === 200) {
                    console.log("responce data =>",response.data.routes)
                    setSearchResults(response.data.routes || []);
                    setShowResults(true);
                }
            } catch (error) {
                console.error('Error searching routes:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500); // 500ms debounce

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery]);

    const handleSelectRoute = (route) => {
        setSelectedRoute(route);
        setShowResults(false);
        setSearchQuery('');
    };

    const handleClearSelection = () => {
        setSelectedRoute(null);
        setSearchQuery('');
        setSearchResults([]);

        setShowResults(false);
    };

    return (
        <div className="w-96 z-50 rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300">
            {/* Search Header with Gradient Background */}
                <div className="relative">
                    <div className="absolute left-3 top-3.5 text-white opacity-70">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search routes, stops, buses..."
                        value={searchQuery}
                        onChange={(e) =>{
                             setSearchQuery(e.target.value)
                             if(e.target.value.trim() === "") setIsSearching(false)
                             setSelectedRoute(null)
                             setShowResults(true)
                        }}
                        onFocus={() => searchQuery && setShowResults(true)}
                        className="w-full px-4 py-3 pl-10 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 dark:ring-offset-red-800 transition font-medium"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-3.5">
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

            {/* Search Results Dropdown */}
            {showResults && !selectedRoute && (
                <div className="max-h-[500px] overflow-y-auto bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                    {searchResults.length > 0 ? (
                        <div className="divide-y dark:divide-gray-700">
                            {searchResults.map((route) => (
                                <div
                                    key={route._id}
                                    onClick={() => handleSelectRoute(route)}
                                    className="p-4 cursor-pointer hover:bg-red-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-l-4 border-l-transparent hover:border-l-red-500"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                                Route <span className="text-red-600">{route.routeNo}</span>
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {route.stops.slice(0, 2).join(' → ')}
                                                {route.stops.length > 2 ? '...' : ''}
                                            </p>
                                        </div>
                                        <div className="text-xs font-semibold text-white bg-red-600 dark:bg-red-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                            {route.bus ? `BUS ${route.bus.busNo}` : 'Unassigned'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <svg
                                className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No routes found</p>
                            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Try searching by route number or stop name</p>
                        </div>
                    )}
                </div>
            )}

            {/* Selected Route Details */}
            {selectedRoute && (
                <div className="p-5 bg-white dark:bg-gray-800 max-h-[600px] overflow-y-auto">
                    {/* Header with Close Button */}
                    <div className="flex items-start justify-between mb-5 pb-4 border-b dark:border-gray-700">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Route <span className="text-red-600">{selectedRoute.routeNo}</span>
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <span className="font-semibold">Last updated:</span> {formatUpdateTime(selectedRoute.updatedAt)}
                            </p>
                        </div>
                        <button
                            onClick={handleClearSelection}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        >
                            <svg
                                className="w-6 h-6 text-gray-600 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Bus Information Card */}
                    <div className="mb-5 p-4 bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-xl border-2 border-red-200 dark:border-red-800/50 shadow-sm">
                        <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest mb-3">
                            🚌 Assigned Bus
                        </p>
                        {selectedRoute.bus ? (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
                                    <svg
                                        className="w-7 h-7 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold">Bus Number</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {selectedRoute.bus.busNo}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-4">
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 font-semibold">No Bus Assigned</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Route is currently available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stops Information */}
                    <div>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="text-lg">📍</span> Route Stops
                        </p>
                        <div className="space-y-3 relative">
                            {/* Vertical line connecting stops */}
                            <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-linear-to-b from-green-400 via-blue-400 to-red-400"></div>
                            
                            {selectedRoute.stops.map((stop, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-4 relative z-10"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shrink-0 border-4 border-white dark:border-gray-800 ${
                                        idx === 0
                                            ? 'bg-green-500 ring-2 ring-green-300 dark:ring-green-700'
                                            : idx === selectedRoute.stops.length - 1
                                            ? 'bg-red-500 ring-2 ring-red-300 dark:ring-red-700'
                                            : 'bg-blue-500 ring-2 ring-blue-300 dark:ring-blue-700'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {stop}
                                        </p>
                                        {idx === 0 && (
                                            <span className="text-xs font-semibold text-green-600 dark:text-green-400 inline-block mt-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                                📍 Starting Point
                                            </span>
                                        )}
                                        {idx === selectedRoute.stops.length - 1 && (
                                            <span className="text-xs font-semibold text-red-600 dark:text-red-400 inline-block mt-1 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                                                🏁 Final Destination
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
