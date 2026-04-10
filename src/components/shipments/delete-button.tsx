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
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "8px 14px",
          border: "1px solid #fdd5c8", borderRadius: "9px",
          fontSize: "12px", fontWeight: 600, color: "var(--color-accent)",
          background: "#fff8f5", cursor: "pointer", fontFamily: "var(--font-body)",
        }}
      >
        <Trash2 size={12} /> Delete
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "16px" }}>
          <div style={{ background: "white", borderRadius: "18px", width: "100%", maxWidth: "380px", padding: "28px", fontFamily: "var(--font-body)", boxShadow: "0 24px 48px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "24px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fff4f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertTriangle size={18} color="var(--color-accent)" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "6px" }}>Delete shipment?</p>
                <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", fontWeight: 300, lineHeight: 1.5 }}>
                  This will permanently remove the shipment and all tracking history. This cannot be undone.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleDelete}
                disabled={isPending}
                style={{ flex: 1, padding: "11px", background: "var(--color-accent)", color: "white", border: "none", borderRadius: "9px", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-display)", cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.6 : 1 }}
              >
                {isPending ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{ flex: 1, padding: "11px", background: "white", color: "var(--color-ink)", border: "1.5px solid var(--color-border)", borderRadius: "9px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}
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
