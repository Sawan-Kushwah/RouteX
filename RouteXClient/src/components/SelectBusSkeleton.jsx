import React from 'react'

const SelectBusSkeleton = () => {
    return (
        <main className="container mx-auto px-6 py-10 animate-pulse">

            {/* Title */}
            <div className="h-8 w-64 bg-gray-700 rounded mb-8"></div>

            {/* Search Bar */}
            <div className="relative mb-10">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-600 rounded"></div>
                <div className="w-full h-12 bg-gray-800 border border-gray-700 rounded-lg"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {Array.from({ length: 9 }).map((_, i) => (
                    <div
                        key={i}
                        className="relative bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 shadow"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">

                            {/* Bus Number + Route */}
                            <div>
                                <div className="h-5 w-40 bg-gray-700 rounded mb-3"></div>
                                <div className="h-4 w-24 bg-purple-700/40 rounded"></div>
                            </div>

                            {/* Icon */}
                            <div className="w-10 h-10 bg-purple-700/40 rounded-full"></div>
                        </div>

                        {/* Stops Label */}
                        <div className="h-3 w-20 bg-gray-600 rounded mb-4"></div>

                        {/* Stops Chips */}
                        <div className="flex flex-wrap gap-2">
                            <div className="px-2 py-1 bg-gray-700 w-20 h-6 rounded"></div>
                            <div className="px-2 py-1 bg-gray-700 w-24 h-6 rounded"></div>
                            <div className="px-2 py-1 bg-gray-700 w-16 h-6 rounded"></div>
                            <div className="px-2 py-1 bg-purple-700/40 w-16 h-6 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default SelectBusSkeleton


