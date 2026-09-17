export default function ShipmentsLoading() {
  return (
    <div className="p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-6 w-28 bg-gray-200 rounded-md animate-pulse mb-2" />
          <div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-9 w-36 bg-gray-200 rounded-[10px] animate-pulse" />
      </div>

      <div className="flex gap-2.5 mb-4 items-center">
        <div className="flex-1 h-9 bg-white border border-gray-100 rounded-[9px] animate-pulse" />
        <div className="h-9 w-32 bg-white border border-gray-100 rounded-[9px] animate-pulse" />
        <div className="h-9 w-28 bg-white border border-gray-100 rounded-[9px] animate-pulse" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="py-3 px-6 border-b border-gray-50 flex gap-8">
          {["w-20", "w-16", "w-14", "w-20", "w-16"].map((w, i) => (
            <div key={i} className={`h-2.5 ${w} bg-gray-100 rounded animate-pulse`} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`py-4 px-6 gap-6 flex items-center${i < 7 ? " border-b border-gray-50" : ""}`}
          >
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
            <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
