import { getDashboardStats, getShipmentsByMonth } from "@/lib/actions/shipments";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export const revalidate = 300;

export default async function AnalyticsPage() {
  const [stats, monthlyData] = await Promise.all([getDashboardStats(), getShipmentsByMonth()]);
  const deliveryRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0;

  // Recharts' <Cell fill> requires a raw SVG color value, not a Tailwind class.
  const statusData = [
    { name: "Pending",    value: stats.pending,    fill: "#e5e5e0" },
    { name: "In Transit", value: stats.in_transit, fill: "#6366f1" },
    { name: "Delivered",  value: stats.delivered,  fill: "#16a34a" },
    { name: "Failed",     value: stats.failed,     fill: "#c8410a" },
  ].filter((d) => d.value > 0);

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="font-extrabold text-2xl text-[var(--color-ink)] tracking-[-0.03em] mb-1">
          Analytics
        </h1>
        <p className="text-[13px] text-[var(--color-ink-muted)] font-light">
          Performance across all shipments
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",          value: stats.total },
          { label: "Delivered",      value: stats.delivered },
          { label: "Delivery Rate",  value: `${deliveryRate}%` },
          { label: "Failed",         value: stats.failed },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-ink-muted)] mb-2.5">{s.label}</p>
            <p className="font-extrabold text-[32px] text-[var(--color-ink)] tracking-[-0.04em] leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      <AnalyticsCharts monthlyData={monthlyData} statusData={statusData} />
    </div>
  );
}
