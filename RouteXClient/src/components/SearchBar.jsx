import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import server from '../utils/backendServer';
import formatUpdateTime from '../utils/formatUpdateTime';
import { Search } from 'lucide-react';
import SearchBarSkeleton from './SearchBarSkeleton';

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const debounceTimer = useRef(null);

    // ---------------------- SEARCH ----------------------
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (!searchQuery.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);

        debounceTimer.current = setTimeout(async () => {
            try {
                const response = await axios.get(`${server}/routes/searchRoutes`, {
                    params: { q: searchQuery, limit: 10 }
                });

                if (response.status === 200) {
                    setSearchResults(response.data.routes || []);
                    setShowResults(true);
                }
            } catch (error) {
                console.error("Error searching routes:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 600);

        return () => clearTimeout(debounceTimer.current);
    }, [searchQuery]);

    // ---------------------- SELECT ROUTE ----------------------
    const handleSelectRoute = (route) => {
        setSelectedRoute(route);
        setShowResults(false); // hide list
    };

    // ---------------------- BACK BUTTON FIX ----------------------
    const handleBackToResults = () => {
        setSelectedRoute(null);   // close selected route
        setShowResults(true);     // show old results again
        // ❗ DO NOT clear searchQuery
        // ❗ DO NOT clear searchResults
    };

    // ---------------------- CLEAR EVERYTHING ----------------------
    const handleClearAll = () => {
        setSelectedRoute(null);
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };

    return (
        <div className="w-96 z-50">

            {/* ---------------- SEARCH BAR ---------------- */}
            <div className="relative flex items-center">
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <Search className="w-5 h-5" color="#9ca3af" />
                </div>

                <input
                    type="text"
                    placeholder="Search routes, stops, buses..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSelectedRoute(null);
                        setSearchQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => searchQuery && setShowResults(true)}
                    // --- CHANGED: Search bar is now white ---
                    className="w-full px-5 py-3 pl-5 pr-24 rounded-full bg-white text-gray-900 placeholder-gray-500
                               focus:outline-none border border-gray-300 focus:border-red-500 shadow-xl transition duration-300 text-sm font-semibold"
                />
            </div>

            {/* ---------------- RESULTS CONTAINER ---------------- */}
            {/* Use a clear max-height and overflow-y for scrolling the main content block */}
            <div className="mt-4">

                {/* ---------------- LOADING ---------------- */}
                {isSearching && !selectedRoute && (
                    <SearchBarSkeleton />
                )}

                {/* ---------------- RESULTS LIST ---------------- */}
                {!isSearching && showResults && !selectedRoute && (
                    // Added explicit max-height for scrolling and better base styling
                    <div className="max-h-[450px] overflow-y-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl divide-y divide-gray-100">
                        {searchResults.length > 0 ? (
                            searchResults.map((route) => (
                                <div
                                    key={route._id}
                                    onClick={() => handleSelectRoute(route)}
                                    // Increased padding and added ring on hover for better clickability
                                    className="px-5 py-4 cursor-pointer flex justify-between items-center hover:bg-red-50 transition-all ring-1 ring-transparent hover:ring-red-100"
                                >
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">
                                            Route <span className="text-red-700">{route.routeNo}</span>
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate max-w-[250px]">
                                            {route.stops.slice(0, 2).join(' → ')}
                                            {route.stops.length > 2 ? " → ..." : ""}
                                        </p>
                                    </div>

                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap
                                ${route.bus
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-yellow-100 text-yellow-800'}
                            `}>
                                        {route.bus ? `BUS ${route.bus.busNo}` : 'UNASSIGNED'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-gray-700 text-base font-medium">No routes found for "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ---------------- SELECTED ROUTE VIEW ---------------- */}
                {selectedRoute && (
                    // Ensure this container has the max-height and handles its own content scrolling
                    <div className="mt-4 p-5 bg-white rounded-xl shadow-2xl max-h-[600px] overflow-y-auto">

                        {/* BACK BUTTON */}
                        <button
                            onClick={handleBackToResults}
                            className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-700 hover:text-red-600 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"
                                className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Results
                        </button>
                        <hr className="mb-4" /> {/* Added separator */}

                        <div className="flex justify-between items-start mb-6"> {/* items-start for better alignment */}
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900"> {/* Bigger, bolder route number */}
                                    Route <span className="text-red-700">{selectedRoute.routeNo}</span>
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Last updated: {formatUpdateTime(selectedRoute.updatedAt)}
                                </p>
                            </div>

                            <button onClick={handleClearAll} className="p-2 text-xl font-light rounded-full text-gray-500 hover:bg-red-50 hover:text-red-700 transition">
                                ✕
                            </button>
                        </div>

                        {/* BUS INFO */}
                        <div className="mb-7 p-4 bg-red-50 border border-red-200 rounded-xl shadow-inner"> {/* Subtle, cleaner bus info box */}
                            <p className="text-xs font-bold text-red-600 uppercase mb-2">
                                Assigned Bus
                            </p>

                            {selectedRoute.bus ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-2xl">🚌</span> {/* Icon is larger */}
                                    </div>
                                    <div>
                                        <p className="text-xs text-red-500 font-medium">BUS NUMBER</p>
                                        <p className="text-2xl font-extrabold text-red-800">
                                            {selectedRoute.bus.busNo}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 border-2 border-dashed border-yellow-300 rounded-lg bg-yellow-50">
                                    <p className="text-yellow-800 font-medium text-sm">No Bus Assigned</p>
                                </div>
                            )}
                        </div>

                        {/* STOPS */}
                        <div>
                            <p className="text-sm font-bold text-gray-700 uppercase mb-4">Route Stops</p>
                            <div className="space-y-4 relative pl-3"> {/* Added pl-3 for line space */}

                                {/* Vertical line connecting the stops (optional, requires more styling) */}
                                <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-red-200"></div>

                                {selectedRoute.stops.map((stop, idx) => (
                                    <div key={idx} className="flex items-start gap-5 relative z-10"> {/* z-10 for the stop circle to overlap the line */}
                                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-md">
                                            {/* Stop number is now centered and smaller */}
                                            {idx + 1}
                                        </div>
                                        <p className="text-base font-semibold text-gray-800 pt-0.5">
                                            {stop}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
