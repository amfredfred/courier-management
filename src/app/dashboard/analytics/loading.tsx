export default function AnalyticsLoading() {
  return (
    <div className="p-10">
      <div className="mb-8">
        <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-2" />
        <div className="h-3.5 w-56 bg-gray-100 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[14px] border border-gray-100 p-5">
            <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="h-7 w-12 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse mb-5" />
          <div className="h-52 bg-gray-50 rounded-lg animate-pulse" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse mb-5" />
          <div className="h-52 max-w-[180px] bg-gray-50 rounded-full animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}
