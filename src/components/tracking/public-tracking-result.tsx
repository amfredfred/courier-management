import type { Shipment, ShipmentStatus, TrackingEvent } from "@/types";
import { formatDate, formatDateShort } from "@/lib/utils";

interface Props { shipment: Shipment }

const PIPELINE: Array<{ status: ShipmentStatus; label: string; desc: string }> = [
  { status: "pending",           label: "Order Received",    desc: "Shipment registered" },
  { status: "picked_up",         label: "Picked Up",         desc: "Package collected" },
  { status: "in_transit",        label: "In Transit",        desc: "En route to destination" },
  { status: "out_for_delivery",  label: "Out for Delivery",  desc: "With delivery agent" },
  { status: "delivered",         label: "Delivered",         desc: "Package delivered" },
];

const STATUS_RANK: Record<ShipmentStatus, number> = {
  pending: 0, picked_up: 1, in_transit: 2, out_for_delivery: 3, delivered: 4,
  failed_delivery: 3, returned: 2, cancelled: 0,
};

const EXCEPTION_STATUSES: ShipmentStatus[] = ["failed_delivery", "returned", "cancelled"];

export function PublicTrackingResult({ shipment }: Props) {
  const isException = EXCEPTION_STATUSES.includes(shipment.status);
  const currentRank = STATUS_RANK[shipment.status] ?? 0;
  const events = [...(shipment.tracking_events ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const latestEvent = events[0];
  const attachments = shipment.attachments ?? [];

  const topStripBg = isException
    ? "bg-[#fff4f1]"
    : shipment.status === "delivered"
    ? "bg-[var(--color-success-light)]"
    : "bg-[#fafaf8]";

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[20px] overflow-hidden">
      {/* Top strip */}
      <div className={`p-6 gap-4 border-b border-[var(--color-border)] flex items-start justify-between flex-wrap ${topStripBg}`}>
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--color-ink-muted)]">
            Tracking Number
          </p>
          <p className="font-mono text-lg font-bold text-[var(--color-ink)] tracking-[0.04em]">
            {shipment.tracking_id}
          </p>
        </div>
        <StatusPill status={shipment.status} />
      </div>

      {/* Route */}
      <div className="p-6 gap-4 border-b border-[var(--color-border)] grid items-center grid-cols-[1fr_auto_1fr]">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-ink-muted)]">From</p>
          <p className="text-[15px] font-semibold text-[var(--color-ink)]">{shipment.sender_name}</p>
          <p className="mt-0.5 text-[13px] text-[var(--color-ink-muted)]">{shipment.sender_address}</p>
        </div>
        <div className="text-center">
          <svg width="48" height="16" fill="none" viewBox="0 0 48 16">
            <path d="M0 8h44M38 2l6 6-6 6" stroke="#d0d0cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="text-right">
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-ink-muted)]">To</p>
          <p className="text-[15px] font-semibold text-[var(--color-ink)]">{shipment.receiver_name}</p>
          <p className="mt-0.5 text-[13px] text-[var(--color-ink-muted)]">{shipment.receiver_address}</p>
        </div>
      </div>

      {/* Est. delivery */}
      {shipment.estimated_delivery && !isException && (
        <div className="py-4 px-6 gap-2.5 border-b border-[var(--color-border)] flex items-center">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#b0b0a8" strokeWidth="1.5"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="#b0b0a8" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-[13px] text-[var(--color-ink-muted)]">
            Estimated delivery: <strong className="text-[var(--color-ink)]">{formatDateShort(shipment.estimated_delivery)}</strong>
          </span>
        </div>
      )}

      {/* Progress pipeline */}
      {!isException && (
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-start relative">
            {PIPELINE.map((step, i) => {
              const done = currentRank >= i;
              const active = currentRank === i;
              const isLast = i === PIPELINE.length - 1;
              const nodeActive = done && active && shipment.status !== "delivered";
              return (
                <div key={step.status} className="flex-1 flex flex-col items-center relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div className={`absolute top-4 left-1/2 w-full h-0.5 transition-colors duration-300 ${currentRank > i ? "bg-[var(--color-accent)]" : "bg-[#e8e8e4]"}`} />
                  )}
                  {/* Node */}
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 relative shrink-0 transition-all duration-300 ${
                    done
                      ? nodeActive
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                        : "border-[#1a7a45] bg-[#1a7a45]"
                      : "border-[#e0e0da] bg-white"
                  }`}>
                    {done ? (
                      nodeActive ? (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      ) : (
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d0d0cc]" />
                    )}
                  </div>
                  {/* Label */}
                  <p className={`mt-2 text-[10px] text-center tracking-[0.01em] leading-[1.3] max-w-[60px] ${
                    done ? "font-semibold text-[var(--color-ink)]" : "font-normal text-[#b8b8b2]"
                  }`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Exception banner */}
      {isException && (
        <div className="m-6 py-4 px-5 gap-2.5 bg-[#fff4f1] border border-[#fdd5c8] rounded-xl flex items-start">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="mt-px shrink-0">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <p className="text-[13px] font-semibold text-[var(--color-accent)]">
              {shipment.status === "failed_delivery" ? "Delivery attempt failed" : shipment.status === "returned" ? "Shipment returned to sender" : "Shipment cancelled"}
            </p>
            <p className="mt-0.5 text-xs text-[#9a4020]">
              {latestEvent?.description ?? "Please contact us for assistance."}
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className={`p-6 ${attachments.length > 0 ? "border-b border-[var(--color-border)]" : ""}`}>
        <p className="mb-6 text-[15px] font-bold text-[var(--color-ink)] tracking-[-0.01em]">
          Shipment History
        </p>
        {events.length > 0 ? (
          <div className="space-y-0">
            {events.map((event, i) => (
              <TimelineRow key={event.id} event={event} isFirst={i === 0} isLast={i === events.length - 1} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-ink-muted)]">No updates yet.</p>
        )}
      </div>

      {/* Proof images (if any, and if delivered) */}
      {attachments.length > 0 && (
        <div className="p-6">
          <p className="mb-5 text-[15px] font-bold text-[var(--color-ink)] tracking-[-0.01em]">
            Delivery Confirmation
          </p>
          <div className="gap-2.5 grid grid-cols-[repeat(auto-fit,minmax(120px,160px))]">
            {attachments
              .filter((a) => a.file_type?.startsWith("image/"))
              .map((att) => (
                <a key={att.id} href={att.file_url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="aspect-square rounded-[10px] overflow-hidden bg-[#f5f5f3] border border-[var(--color-border)]">
                    <img src={att.file_url} alt={att.file_name} className="w-full h-full object-cover" />
                  </div>
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineRow({ event, isFirst, isLast }: { event: TrackingEvent; isFirst: boolean; isLast: boolean }) {
  return (
    <div className={`gap-4 flex relative ${isLast ? "pb-0" : "pb-5"}`}>
      {/* Spine */}
      {!isLast && (
        <div className={`absolute left-[11px] top-6 bottom-0 w-px ${isFirst ? "bg-[#e8e8e4]" : "bg-[#f0f0ec]"}`} />
      )}
      {/* Dot */}
      <div className={`mt-px w-[23px] h-[23px] rounded-full shrink-0 border-2 flex items-center justify-center z-10 ${
        isFirst ? "bg-[var(--color-ink)] border-[var(--color-ink)]" : "bg-[#f0f0ec] border-[#e0e0da]"
      }`}>
        {isFirst && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      {/* Content */}
      <div className="pt-0.5 flex-1">
        <div className="gap-2 flex items-baseline flex-wrap">
          <p className={`text-sm ${isFirst ? "font-semibold text-[var(--color-ink)]" : "font-normal text-[#9a9a94]"}`}>
            {event.description ?? event.status.replace(/_/g, " ")}
          </p>
          {event.location && (
            <span className="gap-[3px] text-xs text-[#b0b0a8] flex items-center">
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
              </svg>
              {event.location}
            </span>
          )}
        </div>
        <p className="mt-[3px] text-[11px] text-[#c0c0b8]">{formatDate(event.created_at)}</p>
      </div>
    </div>
  );
}

const STATUS_PILL: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending:          { bg: "bg-[#f5f5f3]", text: "text-[#6b6b6b]", dot: "bg-[#6b6b6b]", label: "Pending" },
  picked_up:        { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]", dot: "bg-[#1d4ed8]", label: "Picked Up" },
  in_transit:       { bg: "bg-[#f0f0ff]", text: "text-[#4338ca]", dot: "bg-[#4338ca]", label: "In Transit" },
  out_for_delivery: { bg: "bg-[#fdf4ff]", text: "text-[#7e22ce]", dot: "bg-[#7e22ce]", label: "Out for Delivery" },
  delivered:        { bg: "bg-[var(--color-success-light)]", text: "text-[var(--color-success)]", dot: "bg-[var(--color-success)]", label: "Delivered" },
  failed_delivery:  { bg: "bg-[#fff4f1]", text: "text-[var(--color-accent)]", dot: "bg-[var(--color-accent)]", label: "Delivery Failed" },
  returned:         { bg: "bg-[#fff7ed]", text: "text-[#c2410c]", dot: "bg-[#c2410c]", label: "Returned" },
  cancelled:        { bg: "bg-[#f5f5f3]", text: "text-[#6b6b6b]", dot: "bg-[#6b6b6b]", label: "Cancelled" },
};

function StatusPill({ status }: { status: ShipmentStatus }) {
  const c = STATUS_PILL[status] ?? STATUS_PILL.pending;
  return (
    <div className={`gap-1.5 py-1.5 px-3.5 inline-flex items-center rounded-full shrink-0 whitespace-nowrap ${c.bg}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      <span className={`text-xs font-semibold tracking-[0.01em] ${c.text}`}>
        {c.label}
      </span>
    </div>
  );
}
