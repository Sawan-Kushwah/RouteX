import React from 'react'

const MapComponentSkeleton = () => {
    return (
        <div className="relative w-full h-[92vh] bg-gray-400 overflow-hidden animate-pulse">

            {/* Fake map grid */}
            <div className="absolute inset-0 
    bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,rgba(0,0,0,0.15)_1px,transparent_1px),
        linear-gradient(rgba(255,255,255,0.07)_1px,rgba(0,0,0,0.15)_1px,transparent_1px)]
    bg-size-[80px_80px] opacity-50">
            </div>

            {/* Top Right Status Box */}
            <div className="hidden sm:block absolute top-5 right-5 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-xl px-5 py-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="h-3 w-24 bg-gray-700 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="h-3 w-32 bg-gray-700 rounded"></div>
                </div>
            </div>

            {/* Bottom Right Legend */}
            <div className="absolute ms:bottom-5 bottom-20 right-5 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-xl px-4 py-3 space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div className="h-3 w-20 bg-gray-700 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <div className="h-3 w-20 bg-gray-700 rounded"></div>
                </div>
            </div>

            {/* Center Marker (Your Location) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

                <div className="flex items-center gap-2">
                    {/* Marker Icon */}
                    <div className="w-10 h-10">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="red"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-full h-full"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                            />
                            <circle cx="12" cy="9" r="2" fill="white" />
                        </svg>
                    </div>

                    {/* Label */}
                    <div className="h-8 w-20 bg-gray-700 rounded"></div>
                </div>
            </div>

            {/* Zoom Buttons Placeholder */}
            <div className="absolute bottom-20 sm:bottom-5 left-5 space-y-2">
                <div>

                <div className="w-8 h-8 bg-gray-700 rounded-md mb-1"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-md"></div>
                </div>
                <div className="w-28 sm:hidden h-8 rounded-md bg-gray-700"></div>

            </div>
            <div className="absolute top-5 left-8 space-y-2">
                <div className="w-80 sm:w-96 h-10 rounded-full bg-gray-700"></div>
            </div>
        </div>
    );
}

export default MapComponentSkeleton
