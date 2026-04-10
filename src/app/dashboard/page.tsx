import { getDashboardStats, getShipments } from "@/lib/actions/shipments";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

export const revalidate = 60;

const STATUS_STYLE: Record<string, { dot: string; label: string }> = {
  pending:          { dot: "#9ca3af", label: "Pending" },
  picked_up:        { dot: "#3b82f6", label: "Picked Up" },
  in_transit:       { dot: "#6366f1", label: "In Transit" },
  out_for_delivery: { dot: "#8b5cf6", label: "Out for Delivery" },
  delivered:        { dot: "#16a34a", label: "Delivered" },
  failed_delivery:  { dot: "#dc2626", label: "Failed" },
  returned:         { dot: "#ea580c", label: "Returned" },
  cancelled:        { dot: "#9ca3af", label: "Cancelled" },
};

export default async function DashboardPage() {
  const [stats, { shipments }] = await Promise.all([
    getDashboardStats(),
    getShipments({ limit: 8 }),
  ]);

  const hasShipments = shipments.length > 0;

  return (
    <div style={{ padding: "36px 40px", fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.03em", marginBottom: "4px" }}>
            Overview
          </h1>
          <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", fontWeight: 300 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link href="/dashboard/shipments/new" style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          padding: "10px 18px",
          background: "var(--color-ink)", color: "white",
          borderRadius: "10px", textDecoration: "none",
          fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-display)",
          letterSpacing: "-0.01em",
        }}>
          <Plus size={14} strokeWidth={2.5} />
          New shipment
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
        {[
          { label: "Total",       value: stats.total,      sub: "all time" },
          { label: "In Transit",  value: stats.in_transit, sub: "active" },
          { label: "Delivered",   value: stats.delivered,  sub: stats.total > 0 ? `${Math.round((stats.delivered / stats.total) * 100)}% rate` : "0% rate" },
          { label: "Today",       value: stats.today,      sub: "new shipments" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "white",
            border: "1px solid var(--color-border)",
            borderRadius: "14px",
            padding: "20px 22px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "10px" }}>
              {s.label}
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {s.value}
            </p>
            <p style={{ fontSize: "11px", color: "#b8b8b2", marginTop: "6px" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent shipments */}
      <div style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--color-ink)", letterSpacing: "-0.01em" }}>
            Recent Shipments
          </p>
          {hasShipments && (
            <Link href="/dashboard/shipments" style={{ fontSize: "12px", color: "var(--color-accent)", fontWeight: 600, textDecoration: "none" }}>
              View all →
            </Link>
          )}
        </div>

        {!hasShipments ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h6m-3-3v3" stroke="#b8b8b2" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="9" y="11" width="14" height="10" rx="2" stroke="#b8b8b2" strokeWidth="1.5"/>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "6px" }}>
              No shipments yet
            </p>
            <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", marginBottom: "20px", fontWeight: 300 }}>
              Create your first shipment to get started.
            </p>
            <Link href="/dashboard/shipments/new" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "9px 18px",
              background: "var(--color-ink)", color: "white",
              borderRadius: "9px", textDecoration: "none",
              fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-display)",
            }}>
              <Plus size={13} />
              Create shipment
            </Link>
          </div>
        ) : (
          <div>
            {shipments.map((s, i) => {
              const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.pending;
              return (
                <Link key={s.id} href={`/dashboard/shipments/${s.id}`} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "14px 24px",
                  borderBottom: i < shipments.length - 1 ? "1px solid #f7f7f5" : "none",
                  textDecoration: "none",
                  transition: "background 0.1s",
                }} className="hover:bg-gray-50">
                  <div style={{ flex: "0 0 auto" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: "var(--color-ink)", background: "var(--color-surface)", padding: "3px 8px", borderRadius: "5px", letterSpacing: "0.04em" }}>
                      {s.tracking_id}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {s.sender_name} <span style={{ color: "#c0c0b8", margin: "0 6px" }}>→</span> {s.receiver_name}
                    </p>
                    <p style={{ fontSize: "11px", color: "#b8b8b2", marginTop: "2px" }}>
                      {s.receiver_address}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: st.dot }} />
                    <span style={{ fontSize: "12px", color: "var(--color-ink-muted)", fontWeight: 500 }}>{st.label}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#c0c0b8", flexShrink: 0, display: "none" }} className="sm:block">
                    {formatDate(s.created_at)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
