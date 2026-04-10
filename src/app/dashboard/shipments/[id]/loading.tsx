export default function ShipmentDetailLoading() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 h-44 animate-pulse" />
          <div className="bg-white rounded-xl border border-gray-100 h-32 animate-pulse" />
          <div className="bg-white rounded-xl border border-gray-100 h-40 animate-pulse" />
        </div>
        <div className="space-y-5">
          <div className="bg-amber-50 rounded-xl border border-amber-100 h-24 animate-pulse" />
          <div className="bg-white rounded-xl border border-gray-100 h-64 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
