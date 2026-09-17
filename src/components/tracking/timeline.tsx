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
    <div>
      {sorted.map((event, i) => {
        const isLatest = i === 0;
        const isLast = i === sorted.length - 1;
        return (
          <div key={event.id} className={`flex gap-3.5 relative ${isLast ? "pb-0" : "pb-5"}`}>
            {!isLast && (
              <div className="absolute left-2.5 top-[22px] bottom-0 w-px bg-[#f0f0ec]" />
            )}
            <div className={`w-[21px] h-[21px] rounded-full shrink-0 mt-px border-2 flex items-center justify-center relative z-10 ${
              isLatest ? "border-[var(--color-ink)] bg-[var(--color-ink)]" : "border-[#e0e0da] bg-white"
            }`}>
              {isLatest && <div className="w-[5px] h-[5px] rounded-full bg-white" />}
            </div>
            <div className="flex-1 pt-px">
              <p className={`text-[13px] mb-0.5 ${isLatest ? "font-semibold text-[var(--color-ink)]" : "font-normal text-[#a0a09a]"}`}>
                {event.description ?? STATUS_LABELS[event.status]}
              </p>
              {event.location && (
                <p className="text-[11px] text-[#b8b8b2] mb-0.5">📍 {event.location}</p>
              )}
              <p className="text-[11px] text-[#c8c8c0]">{formatDate(event.created_at)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
