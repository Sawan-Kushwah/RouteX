export default function AdminDashboardSkeleton() {
  return (
    <div className="flex bg-[#111827] min-h-screen">

      {/* -------------------- LEFT SIDEBAR -------------------- */}
      <div className="w-64 bg-[#1f2937] p-6 space-y-6 animate-pulse">

        {/* Logo */}
        <div className="h-10 w-32 bg-gray-700/50 rounded-lg"></div>

        {/* Menu Items */}
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-6 w-6 bg-gray-700/40 rounded-md"></div>
              <div className="h-6 w-32 bg-gray-700/40 rounded-md"></div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3">
          <div className="h-6 w-6 bg-red-700/40 rounded-md"></div>
          <div className="h-6 w-20 bg-red-700/40 rounded-md"></div>
        </div>
      </div>

      {/* -------------------- MAIN AREA -------------------- */}
      <div className="flex-1 p-8 animate-pulse">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-10">

          {/* Search Input */}
          <div className="h-10 w-96 bg-gray-700/40 rounded-lg"></div>

          {/* Profile Skeleton */}
          <div className="h-10 w-10 bg-gray-700/50 rounded-full"></div>
        </div>

        {/* Page Title */}
        <div className="h-10 w-60 bg-gray-700/50 rounded-lg mb-6"></div>

        {/* Add New Route Button */}
        <div className="h-14 w-full bg-gray-700/40 rounded-xl mb-8"></div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-700/40 rounded-xl"></div>
          ))}
        </div>

        {/* Table Section */}
        <div className="rounded-xl bg-[#1f2937] shadow px-4 py-4">

          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 mb-4">
            <div className="h-6 bg-gray-700/40 rounded"></div>
            <div className="h-6 bg-gray-700/40 rounded col-span-2"></div>
            <div className="h-6 bg-gray-700/40 rounded"></div>
            <div className="h-6 bg-gray-700/40 rounded"></div>
            <div className="h-6 bg-gray-700/40 rounded"></div>
          </div>

          {/* Skeleton Rows */}
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="grid grid-cols-6 items-center gap-4">
                <div className="h-6 w-full bg-gray-700/30 rounded"></div>
                <div className="h-6 w-full bg-gray-700/30 rounded col-span-2"></div>
                <div className="h-6 w-full bg-gray-700/30 rounded"></div>
                <div className="h-6 w-full bg-gray-700/30 rounded"></div>

                {/* Actions */}
                <div className="flex gap-2">
                  <div className="h-7 w-14 bg-gray-700/40 rounded"></div>
                  <div className="h-7 w-14 bg-gray-700/40 rounded"></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
