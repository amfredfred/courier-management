"use client";

import { useState } from "react";
import { StatusUpdateModal } from "@/components/shipments/status-update-modal";
import type { ShipmentStatus } from "@/types";

interface Props { shipmentId: string; currentStatus: ShipmentStatus; }

export function StatusUpdateClient({ shipmentId, currentStatus }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "8px 14px",
          background: "var(--color-ink)", color: "white",
          border: "none", borderRadius: "9px", cursor: "pointer",
          fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-display)",
          letterSpacing: "-0.01em",
        }}
      >
        Update status
      </button>
      {open && (
        <StatusUpdateModal shipmentId={shipmentId} currentStatus={currentStatus} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
