export default function ShipmentDetailLoading() {
  return (
    <div className="p-10 max-w-[1100px]">
      <div className="h-3.5 w-28 bg-gray-200 rounded animate-pulse mb-6" />

      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-32 bg-gray-200 rounded-[9px] animate-pulse" />
          <div className="h-8 w-20 bg-gray-100 rounded-[9px] animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 h-32 animate-pulse" />
          <div className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse" />
          <div className="bg-white rounded-2xl border border-gray-100 h-40 animate-pulse" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-orange-50 rounded-2xl border border-orange-100 h-24 animate-pulse" />
          <div className="bg-white rounded-2xl border border-gray-100 h-60 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
