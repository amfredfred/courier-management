export default function DashboardLoading() {
  return (
    <div className="p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-9 w-36 bg-gray-200 rounded-[10px] animate-pulse" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[14px] border border-gray-100 p-5">
            <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="h-7 w-12 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-2.5 w-20 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="py-4 px-6 border-b border-gray-100 flex items-center justify-between">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`py-4 px-6 gap-4 flex items-center${i < 7 ? " border-b border-gray-50" : ""}`}
          >
            <div className="h-5 w-28 bg-gray-100 rounded animate-pulse" />
            <div className="flex-1 h-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-100 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
