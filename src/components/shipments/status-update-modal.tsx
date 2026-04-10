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
      if (result.error) { toast.error(result.error); return; }
      toast.success("Status updated" + (notify ? " · email sent" : ""));
      onClose();
    });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "16px" }}>
      <div style={{ background: "white", borderRadius: "18px", width: "100%", maxWidth: "420px", boxShadow: "0 24px 48px rgba(0,0,0,0.12)", fontFamily: "var(--font-body)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--color-border)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--color-ink)", letterSpacing: "-0.02em" }}>Update Status</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0c0b8", padding: "2px" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "7px" }}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--color-border)", borderRadius: "9px", fontSize: "13px", fontFamily: "var(--font-body)", color: "var(--color-ink)", background: "white", outline: "none" }}
            >
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "7px" }}>Location <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Lagos Hub, Distribution Centre"
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--color-border)", borderRadius: "9px", fontSize: "13px", fontFamily: "var(--font-body)", color: "var(--color-ink)", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "7px" }}>Note <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Visible to customer on tracking page…"
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--color-border)", borderRadius: "9px", fontSize: "13px", fontFamily: "var(--font-body)", color: "var(--color-ink)", outline: "none", resize: "none" }}
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} style={{ accentColor: "var(--color-ink)", width: "14px", height: "14px" }} />
            <span style={{ fontSize: "13px", color: "var(--color-ink-muted)" }}>Notify customer by email</span>
          </label>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--color-border)", display: "flex", gap: "10px" }}>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            style={{
              flex: 1, padding: "11px", background: "var(--color-ink)", color: "white",
              border: "none", borderRadius: "9px", fontSize: "13px", fontWeight: 700,
              fontFamily: "var(--font-display)", cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? "Updating…" : "Update Status"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "11px 18px", background: "white", color: "var(--color-ink)",
              border: "1.5px solid var(--color-border)", borderRadius: "9px",
              fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
