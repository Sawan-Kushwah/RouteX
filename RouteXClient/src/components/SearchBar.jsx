import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import server from '../utils/backendServer';
import formatUpdateTime from '../utils/formatUpdateTime';
import { Dot, Search, X } from 'lucide-react';
import SearchBarSkeleton from './SearchBarSkeleton';

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const debounceTimer = useRef(null);

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
                    params: { q: searchQuery, limit: 5 }
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

    const handleSelectRoute = (route) => {
        setSelectedRoute(route);
        setShowResults(false);
    };

    const handleBackToResults = () => {
        setSelectedRoute(null);
        setShowResults(true);
    };

    const handleClearAll = () => {
        setSelectedRoute(null);
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };

    const highlightMatch = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "ig");
        return text.replace(regex, "<mark class='bg-yellow-200 text-red-700 font-bold'>$1</mark>");
    };


    return (
        <>
            <div className="w-[350px] sm:w-96 z-50">

                <div className="relative flex items-center">
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">
                        {(isSearching || showResults || selectedRoute) ?
                            <X color='#ff4f4f' onClick={handleClearAll} className='w-5 h-5 hover:bg-red-50 hover:text-red-700 transition cursor-pointer' />
                            :
                            <Search className="w-5 h-5" color="#9ca3af" />

                        }
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


                <div className="mt-4">

                    {isSearching && !selectedRoute && searchQuery.length > 0 && (
                        <SearchBarSkeleton />
                    )}

                    {!isSearching && showResults && !selectedRoute && (
                        <div className="max-h-72 sm:max-h-[450px] overflow-y-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl divide-y divide-gray-100">
                            {searchResults.length > 0 ? (
                                searchResults.map((route) => (
                                    <div
                                        key={route._id}
                                        onClick={() => handleSelectRoute(route)}
                                        className="px-5 py-4 cursor-pointer flex justify-between items-center hover:bg-red-50 transition-all ring-1 ring-transparent hover:ring-red-100"
                                    >
                                        <div className='sm:max-w-none'>
                                            <div className="text-sm sm:text-base font-bold text-gray-900">
                                                Route <span className="text-red-700">{route.routeNo}</span>
                                                <span className={`text-[10px] ml-1.5 sm:ml-2.5 font-semibold p-1 rounded-sm whitespace-nowrap bg-yellow-100 text-yellow-700 `}>
                                                    {route.updatedAt ? `Revised on ${formatUpdateTime(route.updatedAt)}` : 'UNASSIGNED'}
                                                </span>
                                            </div>
                                            <p
                                                className="text-[10px] sm:text-sm text-gray-600 truncate max-w-[250px]"
                                                dangerouslySetInnerHTML={{
                                                    __html: (() => {
                                                        const query = searchQuery.trim().toLowerCase();

                                                        const matched = route.stops.filter(stop =>
                                                            stop.toLowerCase().includes(query)
                                                        );
                                                        const others = route.stops.filter(stop =>
                                                            !stop.toLowerCase().includes(query)
                                                        );

                                                        const orderedStops = [...matched, ...others];

                                                        const highlighted = orderedStops.slice(0, 4).map(stop =>
                                                            highlightMatch(stop, query)
                                                        );

                                                        return highlighted.join(" → ") +
                                                            (route.stops.length > 4 ? " → ..." : "");
                                                    })()
                                                }}
                                            />
                                        </div>

                                        <span className={`text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap
                                ${route.bus
                                                ? 'bg-green-100 text-green-700'
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

                    {selectedRoute && (
                        <div className="mt-4 p-3 sm:p-5 bg-white rounded-xl shadow-2xl max-h-96 sm:max-h-[600px] overflow-y-auto">
                            <div className='flex justify-between items-center'>
                                <button
                                    onClick={handleBackToResults}
                                    className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-red-600 transition cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"
                                        className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Results
                                </button>

                                <button onClick={handleClearAll} className="p-2 text-xl font-light rounded-full text-gray-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer">
                                    <X color='red' />
                                </button>
                            </div>
                            <hr className="max-sm:hidden mb-4" />

                            <div className="flex justify-between items-start mb-2 sm:mb-6">
                                <div>
                                    <h2 className="text-lg tsm:text-3xl font-extrabold text-gray-900">
                                        Route <span className="text-red-700">{selectedRoute.routeNo}</span>
                                    </h2>
                                    <p className="text-xs text-yellow-700">
                                        Last updated: {formatUpdateTime(selectedRoute.updatedAt)}
                                    </p>
                                </div>

                            </div>

                            {/* BUS INFO */}
                            <div className="mb-2 p-2 sm:mb-7 sm:p-4 bg-green-50 border border-red-200 rounded-xl shadow-inner"> {/* Subtle, cleaner bus info box */}

                                {selectedRoute.bus ? (
                                    <div className=" flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-md">
                                            <span className="text-2xl">🚌</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-green-500 font-bold">BUS NUMBER</p>
                                            <p className="text-2xl font-extrabold text-green-800">
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
                                <div className="space-y-2 sm:space-y-4 relative pl-3">

                                    <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-red-200"></div>

                                    {selectedRoute.stops.map((stop, idx) => (
                                        <div key={idx} className="flex items-start gap-5 relative z-10">
                                            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-md">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm sm:text-base font-semibold text-gray-800 pt-0.5">
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
        </>

    );
}
