export default function ShipmentsLoading() {
  return (
    <div className="p-8">
      <div className="h-8 w-36 bg-gray-200 rounded-lg animate-pulse mb-6" />
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 p-4 h-14 animate-pulse" />
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4">
              <div className="h-5 w-36 bg-gray-100 rounded animate-pulse" />
              <div className="flex-1 h-5 bg-gray-100 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
