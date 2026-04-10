import { getDashboardStats, getShipmentsByMonth } from "@/lib/actions/shipments";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export const revalidate = 300;

export default async function AnalyticsPage() {
  const [stats, monthlyData] = await Promise.all([getDashboardStats(), getShipmentsByMonth()]);
  const deliveryRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0;

  const statusData = [
    { name: "Pending",    value: stats.pending,    fill: "#e5e5e0" },
    { name: "In Transit", value: stats.in_transit, fill: "#6366f1" },
    { name: "Delivered",  value: stats.delivered,  fill: "#16a34a" },
    { name: "Failed",     value: stats.failed,     fill: "#c8410a" },
  ].filter((d) => d.value > 0);

  return (
    <div style={{ padding: "36px 40px", fontFamily: "var(--font-body)" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.03em", marginBottom: "4px" }}>
          Analytics
        </h1>
        <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", fontWeight: 300 }}>
          Performance across all shipments
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total",          value: stats.total },
          { label: "Delivered",      value: stats.delivered },
          { label: "Delivery Rate",  value: `${deliveryRate}%` },
          { label: "Failed",         value: stats.failed },
        ].map((s) => (
          <div key={s.label} style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "14px", padding: "20px 22px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "10px" }}>{s.label}</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <AnalyticsCharts monthlyData={monthlyData} statusData={statusData} />
    </div>
  );
}
