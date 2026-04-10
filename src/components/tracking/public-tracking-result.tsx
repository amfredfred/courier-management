import type { Shipment, ShipmentStatus, TrackingEvent } from "@/types";
import { formatDate, formatDateShort } from "@/lib/utils";
import Image from "next/image";

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

  return (
    <div className="space-y-4">
      {/* Status hero card */}
      <div style={{
        background: "white",
        border: "1px solid var(--color-border)",
        borderRadius: "20px",
        overflow: "hidden",
      }}>
        {/* Top strip */}
        <div style={{
          background: isException ? "#fff4f1" : shipment.status === "delivered" ? "var(--color-success-light)" : "#fafaf8",
          borderBottom: "1px solid var(--color-border)",
          padding: "24px 28px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "6px" }}>
              Tracking Number
            </p>
            <p style={{ fontFamily: "monospace", fontSize: "18px", fontWeight: 700, color: "var(--color-ink)", letterSpacing: "0.04em" }}>
              {shipment.tracking_id}
            </p>
          </div>
          <StatusPill status={shipment.status} />
        </div>

        {/* Route */}
        <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--color-border)", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "6px" }}>From</p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{shipment.sender_name}</p>
            <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", marginTop: "2px" }}>{shipment.sender_address}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <svg width="48" height="16" fill="none" viewBox="0 0 48 16">
              <path d="M0 8h44M38 2l6 6-6 6" stroke="#d0d0cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "6px" }}>To</p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{shipment.receiver_name}</p>
            <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", marginTop: "2px" }}>{shipment.receiver_address}</p>
          </div>
        </div>

        {/* Est. delivery */}
        {shipment.estimated_delivery && !isException && (
          <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#b0b0a8" strokeWidth="1.5"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="#b0b0a8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: "13px", color: "var(--color-ink-muted)" }}>
              Estimated delivery: <strong style={{ color: "var(--color-ink)" }}>{formatDateShort(shipment.estimated_delivery)}</strong>
            </span>
          </div>
        )}

        {/* Progress pipeline */}
        {!isException && (
          <div style={{ padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0", position: "relative" }}>
              {PIPELINE.map((step, i) => {
                const done = currentRank >= i;
                const active = currentRank === i;
                const isLast = i === PIPELINE.length - 1;
                return (
                  <div key={step.status} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                    {/* Connector line */}
                    {!isLast && (
                      <div style={{
                        position: "absolute",
                        top: "16px",
                        left: "50%",
                        width: "100%",
                        height: "2px",
                        background: currentRank > i ? "var(--color-accent)" : "#e8e8e4",
                        transition: "background 0.3s",
                      }} />
                    )}
                    {/* Node */}
                    <div style={{
                      width: "32px", height: "32px",
                      borderRadius: "50%",
                      border: `2px solid ${done ? (active && shipment.status !== "delivered" ? "var(--color-accent)" : "#1a7a45") : "#e0e0da"}`,
                      background: done ? (active && shipment.status !== "delivered" ? "var(--color-accent)" : "#1a7a45") : "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      zIndex: 1,
                      position: "relative",
                      flexShrink: 0,
                      transition: "all 0.3s",
                    }}>
                      {done ? (
                        active && shipment.status !== "delivered" ? (
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "white" }} />
                        ) : (
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )
                      ) : (
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d0d0cc" }} />
                      )}
                    </div>
                    {/* Label */}
                    <p style={{
                      fontSize: "10px",
                      fontWeight: done ? 600 : 400,
                      color: done ? "var(--color-ink)" : "#b8b8b2",
                      marginTop: "8px",
                      textAlign: "center",
                      letterSpacing: "0.01em",
                      lineHeight: 1.3,
                      fontFamily: "var(--font-display)",
                      maxWidth: "60px",
                    }}>
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
          <div style={{ margin: "24px 28px 24px", padding: "14px 18px", background: "#fff4f1", border: "1px solid #fdd5c8", borderRadius: "12px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ marginTop: "1px", flexShrink: 0 }}>
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-accent)" }}>
                {shipment.status === "failed_delivery" ? "Delivery attempt failed" : shipment.status === "returned" ? "Shipment returned to sender" : "Shipment cancelled"}
              </p>
              <p style={{ fontSize: "12px", color: "#9a4020", marginTop: "2px" }}>
                {latestEvent?.description ?? "Please contact us for assistance."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "20px", padding: "28px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "24px", letterSpacing: "-0.01em" }}>
          Shipment History
        </p>
        {events.length > 0 ? (
          <div className="space-y-0">
            {events.map((event, i) => (
              <TimelineRow key={event.id} event={event} isFirst={i === 0} isLast={i === events.length - 1} />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "14px", color: "var(--color-ink-muted)" }}>No updates yet.</p>
        )}
      </div>

      {/* Proof images (if any, and if delivered) */}
      {attachments.length > 0 && (
        <div style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "20px", padding: "28px" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "20px", letterSpacing: "-0.01em" }}>
            Delivery Confirmation
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
            {attachments
              .filter((a) => a.file_type?.startsWith("image/"))
              .map((att) => (
                <a key={att.id} href={att.file_url} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                  <div style={{ aspectRatio: "1", borderRadius: "10px", overflow: "hidden", background: "#f5f5f3", border: "1px solid var(--color-border)" }}>
                    <img src={att.file_url} alt={att.file_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
    <div style={{ display: "flex", gap: "16px", paddingBottom: isLast ? "0" : "20px", position: "relative" }}>
      {/* Spine */}
      {!isLast && (
        <div style={{
          position: "absolute",
          left: "11px",
          top: "24px",
          bottom: 0,
          width: "1px",
          background: isFirst ? "#e8e8e4" : "#f0f0ec",
        }} />
      )}
      {/* Dot */}
      <div style={{
        width: "23px", height: "23px",
        borderRadius: "50%",
        background: isFirst ? "var(--color-ink)" : "#f0f0ec",
        border: `2px solid ${isFirst ? "var(--color-ink)" : "#e0e0da"}`,
        flexShrink: 0,
        marginTop: "1px",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1,
      }}>
        {isFirst && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />}
      </div>
      {/* Content */}
      <div style={{ flex: 1, paddingTop: "2px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
          <p style={{
            fontSize: "14px",
            fontWeight: isFirst ? 600 : 400,
            color: isFirst ? "var(--color-ink)" : "#9a9a94",
            fontFamily: isFirst ? "var(--font-display)" : "var(--font-body)",
          }}>
            {event.description ?? event.status.replace(/_/g, " ")}
          </p>
          {event.location && (
            <span style={{ fontSize: "12px", color: "#b0b0a8", display: "flex", alignItems: "center", gap: "3px" }}>
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
              </svg>
              {event.location}
            </span>
          )}
        </div>
        <p style={{ fontSize: "11px", color: "#c0c0b8", marginTop: "3px" }}>{formatDate(event.created_at)}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: ShipmentStatus }) {
  const configs: Record<string, { bg: string; color: string; label: string }> = {
    pending:          { bg: "#f5f5f3", color: "#6b6b6b",               label: "Pending" },
    picked_up:        { bg: "#eff6ff", color: "#1d4ed8",               label: "Picked Up" },
    in_transit:       { bg: "#f0f0ff", color: "#4338ca",               label: "In Transit" },
    out_for_delivery: { bg: "#fdf4ff", color: "#7e22ce",               label: "Out for Delivery" },
    delivered:        { bg: "var(--color-success-light)", color: "var(--color-success)", label: "Delivered" },
    failed_delivery:  { bg: "#fff4f1", color: "var(--color-accent)",   label: "Delivery Failed" },
    returned:         { bg: "#fff7ed", color: "#c2410c",               label: "Returned" },
    cancelled:        { bg: "#f5f5f3", color: "#6b6b6b",               label: "Cancelled" },
  };
  const c = configs[status] ?? configs.pending;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "6px 14px",
      background: c.bg,
      borderRadius: "100px",
    }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c.color }} />
      <span style={{ fontSize: "12px", fontWeight: 600, color: c.color, fontFamily: "var(--font-display)", letterSpacing: "0.01em" }}>
        {c.label}
      </span>
    </div>
  );
}
