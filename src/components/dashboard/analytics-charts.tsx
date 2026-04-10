"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface Props {
  monthlyData: Array<{ month: string; total: number; delivered: number }>;
  statusData: Array<{ name: string; value: number; fill: string }>;
}

const tooltipStyle = {
  border: "1px solid var(--color-border)",
  borderRadius: "10px",
  fontSize: "12px",
  fontFamily: "var(--font-body)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

export function AnalyticsCharts({ monthlyData, statusData }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px" }}>
      {/* Bar chart */}
      <div style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "24px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "20px", letterSpacing: "-0.01em" }}>
          Shipments over time
        </p>
        {monthlyData.length === 0 ? (
          <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: "13px", color: "var(--color-ink-muted)" }}>No data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#b8b8b2", fontFamily: "var(--font-body)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#b8b8b2", fontFamily: "var(--font-body)" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
              <Bar dataKey="total" fill="#e5e5e0" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="delivered" fill="#0d0d0d" radius={[4, 4, 0, 0]} name="Delivered" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Donut */}
      <div style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "24px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "20px", letterSpacing: "-0.01em" }}>
          Status breakdown
        </p>
        {statusData.length === 0 ? (
          <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: "13px", color: "var(--color-ink-muted)" }}>No data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="45%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value">
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Legend formatter={(v) => <span style={{ fontSize: 11, color: "#6b6b6b", fontFamily: "var(--font-body)" }}>{v}</span>} />
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
