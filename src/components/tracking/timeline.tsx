import type { TrackingEvent, ShipmentStatus } from "@/types";
import { STATUS_LABELS } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  events: TrackingEvent[];
  currentStatus: ShipmentStatus;
}

export function TrackingTimeline({ events, currentStatus }: Props) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {sorted.map((event, i) => {
        const isLatest = i === 0;
        return (
          <div key={event.id} style={{ display: "flex", gap: "14px", paddingBottom: i < sorted.length - 1 ? "20px" : "0", position: "relative" }}>
            {i < sorted.length - 1 && (
              <div style={{ position: "absolute", left: "10px", top: "22px", bottom: 0, width: "1px", background: "#f0f0ec" }} />
            )}
            <div style={{
              width: "21px", height: "21px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
              border: `2px solid ${isLatest ? "var(--color-ink)" : "#e0e0da"}`,
              background: isLatest ? "var(--color-ink)" : "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1,
            }}>
              {isLatest && <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "white" }} />}
            </div>
            <div style={{ flex: 1, paddingTop: "1px" }}>
              <p style={{
                fontSize: "13px",
                fontWeight: isLatest ? 600 : 400,
                color: isLatest ? "var(--color-ink)" : "#a0a09a",
                fontFamily: isLatest ? "var(--font-display)" : "var(--font-body)",
                marginBottom: "2px",
              }}>
                {event.description ?? STATUS_LABELS[event.status]}
              </p>
              {event.location && (
                <p style={{ fontSize: "11px", color: "#b8b8b2", marginBottom: "2px" }}>📍 {event.location}</p>
              )}
              <p style={{ fontSize: "11px", color: "#c8c8c0" }}>{formatDate(event.created_at)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
