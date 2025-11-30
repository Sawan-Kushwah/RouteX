import React from 'react'

const SearchBarSkeleton = () => {
    return (
        <div className="max-h-[450px] overflow-y-auto bg-white/60 rounded-2xl shadow-xl p-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 border-b border-gray-100 animate-pulse flex justify-between">
                    <div className="w-full">
                        <div className="h-5 w-32 bg-gray-300/60 rounded mb-2"></div>
                        <div className="h-4 w-48 bg-gray-200/60 rounded"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-300/60 rounded-full"></div>
                </div>
            ))}
        </div>
    )
}

export default SearchBarSkeleton