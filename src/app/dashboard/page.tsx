import { getDashboardStats, getShipments } from "@/lib/actions/shipments";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

export const revalidate = 60;

const STATUS_STYLE: Record<string, { dot: string; label: string }> = {
  pending:          { dot: "bg-[#9ca3af]", label: "Pending" },
  picked_up:        { dot: "bg-[#3b82f6]", label: "Picked Up" },
  in_transit:       { dot: "bg-[#6366f1]", label: "In Transit" },
  out_for_delivery: { dot: "bg-[#8b5cf6]", label: "Out for Delivery" },
  delivered:        { dot: "bg-[#16a34a]", label: "Delivered" },
  failed_delivery:  { dot: "bg-[#dc2626]", label: "Failed" },
  returned:         { dot: "bg-[#ea580c]", label: "Returned" },
  cancelled:        { dot: "bg-[#9ca3af]", label: "Cancelled" },
};

export default async function DashboardPage() {
  const [stats, { shipments }] = await Promise.all([
    getDashboardStats(),
    getShipments({ limit: 8 }),
  ]);

  const hasShipments = shipments.length > 0;

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-extrabold text-2xl text-[var(--color-ink)] tracking-[-0.03em] mb-1">
            Overview
          </h1>
          <p className="text-[13px] text-[var(--color-ink-muted)] font-light">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link
          href="/dashboard/shipments/new"
          className="inline-flex items-center gap-[7px] py-2.5 px-[18px] bg-[var(--color-ink)] text-white rounded-[10px] no-underline text-[13px] font-semibold tracking-[-0.01em]"
        >
          <Plus size={14} strokeWidth={2.5} />
          New shipment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total",       value: stats.total,      sub: "all time" },
          { label: "In Transit",  value: stats.in_transit, sub: "active" },
          { label: "Delivered",   value: stats.delivered,  sub: stats.total > 0 ? `${Math.round((stats.delivered / stats.total) * 100)}% rate` : "0% rate" },
          { label: "Today",       value: stats.today,      sub: "new shipments" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-ink-muted)] mb-2.5">
              {s.label}
            </p>
            <p className="font-extrabold text-[32px] text-[var(--color-ink)] tracking-[-0.04em] leading-none">
              {s.value}
            </p>
            <p className="text-[11px] text-[#b8b8b2] mt-1.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent shipments */}
      <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="py-4 px-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <p className="font-bold text-sm text-[var(--color-ink)] tracking-[-0.01em]">
            Recent Shipments
          </p>
          {hasShipments && (
            <Link href="/dashboard/shipments" className="text-xs text-[var(--color-accent)] font-semibold no-underline">
              View all →
            </Link>
          )}
        </div>

        {!hasShipments ? (
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h6m-3-3v3" stroke="#b8b8b2" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="9" y="11" width="14" height="10" rx="2" stroke="#b8b8b2" strokeWidth="1.5"/>
              </svg>
            </div>
            <p className="font-bold text-[15px] text-[var(--color-ink)] mb-1.5">
              No shipments yet
            </p>
            <p className="text-[13px] text-[var(--color-ink-muted)] mb-5 font-light">
              Create your first shipment to get started.
            </p>
            <Link
              href="/dashboard/shipments/new"
              className="inline-flex items-center gap-1.5 py-2 px-[18px] bg-[var(--color-ink)] text-white rounded-[9px] no-underline text-[13px] font-semibold"
            >
              <Plus size={13} />
              Create shipment
            </Link>
          </div>
        ) : (
          <div>
            {shipments.map((s, i) => {
              const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.pending;
              return (
                <Link
                  key={s.id}
                  href={`/dashboard/shipments/${s.id}`}
                  className={`flex items-center gap-4 py-4 px-6 no-underline transition-colors duration-100 hover:bg-gray-50 ${
                    i < shipments.length - 1 ? "border-b border-[#f7f7f5]" : "border-b-0"
                  }`}
                >
                  <div className="flex-none">
                    <span className="font-mono text-xs font-semibold text-[var(--color-ink)] bg-[var(--color-surface)] py-[3px] px-2 rounded-[5px] tracking-[0.04em]">
                      {s.tracking_id}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-ink)] whitespace-nowrap overflow-hidden text-ellipsis">
                      {s.sender_name} <span className="text-[#c0c0b8] mx-1.5">→</span> {s.receiver_name}
                    </p>
                    <p className="text-[11px] text-[#b8b8b2] mt-0.5">
                      {s.receiver_address}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    <span className="text-xs text-[var(--color-ink-muted)] font-medium">{st.label}</span>
                  </div>
                  <p className="text-[11px] text-[#c0c0b8] shrink-0 hidden sm:block">
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
