export default function AnalyticsLoading() {
  return (
    <div className="p-8">
      <div className="h-8 w-36 bg-gray-200 rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-24 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 h-72 animate-pulse" />
        <div className="bg-white rounded-xl border border-gray-100 h-72 animate-pulse" />
      </div>
    </div>
  );
}
