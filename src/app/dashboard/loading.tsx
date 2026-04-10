export default function DashboardLoading() {
  return (
    <div className="p-8">
      <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-24 animate-pulse" />
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-64 animate-pulse" />
    </div>
  );
}
