"use client";

import { useState, useTransition } from "react";
import { updateShipmentStatusWithNotification } from "@/lib/actions/shipments";
import type { ShipmentStatus } from "@/types";
import { STATUS_LABELS } from "@/types";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const ALL_STATUSES: ShipmentStatus[] = [
  "pending","picked_up","in_transit","out_for_delivery","delivered","failed_delivery","returned","cancelled",
];

const fieldClass = "w-full py-2.5 px-3 border-[1.5px] border-[var(--color-border)] rounded-[9px] text-[13px] text-[var(--color-ink)] bg-white outline-none";
const labelClass = "block text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--color-ink-muted)] mb-[7px]";

interface Props { shipmentId: string; currentStatus: ShipmentStatus; onClose: () => void; }

export function StatusUpdateModal({ shipmentId, currentStatus, onClose }: Props) {
  const [status, setStatus] = useState<ShipmentStatus>(currentStatus);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [notify, setNotify] = useState(true);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      const result = await updateShipmentStatusWithNotification(shipmentId, status, location || undefined, description || undefined, notify);
      if ("error" in result) { toast.error(result.error); return; }
      toast.success("Status updated" + (notify ? " · email sent" : ""));
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[18px] w-full max-w-[420px] shadow-[0_24px_48px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center justify-between py-5 px-6 border-b border-[var(--color-border)]">
          <p className="font-bold text-[15px] text-[var(--color-ink)] tracking-[-0.02em]">Update Status</p>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer text-[#c0c0b8] p-0.5">
            <X size={16} />
          </button>
        </div>

        <div className="py-5 px-6 flex flex-col gap-3.5">
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
              className={fieldClass}
            >
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Location <span className="font-light normal-case tracking-normal">(optional)</span></label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Lagos Hub, Distribution Centre"
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Note <span className="font-light normal-case tracking-normal">(optional)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Visible to customer on tracking page…"
              className={`${fieldClass} resize-none`}
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="accent-[var(--color-ink)] w-3.5 h-3.5" />
            <span className="text-[13px] text-[var(--color-ink-muted)]">Notify customer by email</span>
          </label>
        </div>

        <div className="py-4 px-6 border-t border-[var(--color-border)] flex gap-2.5">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-[11px] bg-[var(--color-ink)] text-white border-none rounded-[9px] text-[13px] font-bold disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isPending ? "Updating…" : "Update Status"}
          </button>
          <button
            onClick={onClose}
            className="py-[11px] px-[18px] bg-white text-[var(--color-ink)] border-[1.5px] border-[var(--color-border)] rounded-[9px] text-[13px] font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
