export default function DashboardSkeleton() {
    return (
        <div className="animate-pulse">

            {/* ---------------------- STATS CARDS ---------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((_, i) => (
                    <div
                        key={i}
                        className="h-24 bg-gray-700/30 rounded-xl"
                    ></div>
                ))}
            </div>

            {/* ---------------------- TABLE WRAPPER ---------------------- */}
            <div className="bg-[#1f2937] rounded-xl p-4 shadow">

                {/* ---------- TABLE HEADER ---------- */}
                <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-600/30">
                    <div className="col-span-1 h-5 bg-gray-600/30 rounded"></div>
                    <div className="col-span-5 h-5 bg-gray-600/30 rounded"></div>
                    <div className="col-span-2 h-5 bg-gray-600/30 rounded"></div>
                    <div className="col-span-2 h-5 bg-gray-600/30 rounded"></div>
                    <div className="col-span-2 h-5 bg-gray-600/30 rounded"></div>
                </div>

                {/* ---------- SKELETON ROWS ---------- */}
                <div className="mt-3 space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-12 items-center gap-4 py-2 border-b border-gray-700/20"
                        >
                            {/* Route Number */}
                            <div className="col-span-1 h-4 bg-gray-700/30 rounded"></div>

                            {/* Stops (Multiple Pills) */}
                            <div className="col-span-5 flex flex-wrap gap-2">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div
                                        key={j}
                                        className="h-6 w-24 bg-gray-700/30 rounded-full"
                                    ></div>
                                ))}
                                <div className="h-6 w-16 bg-gray-700/40 rounded-full"></div>
                            </div>

                            {/* Assigned Bus */}
                            <div className="col-span-2 h-6 bg-gray-700/30 rounded-md"></div>

                            {/* Last Updated */}
                            <div className="col-span-2 h-6 bg-gray-700/30 rounded-md"></div>

                            {/* Actions (Edit + Delete) */}
                            <div className="col-span-2 flex gap-3">
                                <div className="h-7 w-14 bg-blue-700/40 rounded"></div>
                                <div className="h-7 w-16 bg-red-700/40 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
