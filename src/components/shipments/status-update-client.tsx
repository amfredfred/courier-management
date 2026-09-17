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
        className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[var(--color-ink)] text-white border-none rounded-[9px] cursor-pointer text-xs font-semibold tracking-[-0.01em]"
      >
        Update status
      </button>
      {open && (
        <StatusUpdateModal shipmentId={shipmentId} currentStatus={currentStatus} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
