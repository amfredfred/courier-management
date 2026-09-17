"use client";

import { useState, useTransition } from "react";
import { deleteShipment } from "@/lib/actions/shipments";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function DeleteButton({ shipmentId }: { shipmentId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteShipment(shipmentId);
      if (result.error) { toast.error(result.error); return; }
      toast.success("Shipment deleted");
      router.push("/dashboard/shipments");
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 py-2 px-3.5 border border-[#fdd5c8] rounded-[9px] text-xs font-semibold text-[var(--color-accent)] bg-[#fff8f5] cursor-pointer"
      >
        <Trash2 size={12} /> Delete
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[18px] w-full max-w-[380px] p-7 shadow-[0_24px_48px_rgba(0,0,0,0.12)]">
            <div className="flex gap-3.5 items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-[#fff4f1] flex items-center justify-center shrink-0">
                <AlertTriangle size={18} color="var(--color-accent)" />
              </div>
              <div>
                <p className="font-bold text-[15px] text-[var(--color-ink)] mb-1.5">Delete shipment?</p>
                <p className="text-[13px] text-[var(--color-ink-muted)] font-light leading-normal">
                  This will permanently remove the shipment and all tracking history. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-2.5 bg-[var(--color-accent)] text-white border-none rounded-[9px] text-[13px] font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 bg-white text-[var(--color-ink)] border-[1.5px] border-[var(--color-border)] rounded-[9px] text-[13px] font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
