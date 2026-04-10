"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createShipment, updateShipment } from "@/lib/actions/shipments";
import type { Shipment } from "@/types";
import toast from "react-hot-toast";

interface Props { shipment?: Shipment }

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: error ? "var(--color-accent)" : "var(--color-ink-muted)", marginBottom: "7px" }}>
        {label}{required && <span style={{ color: "var(--color-accent)", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: "11px", color: "var(--color-accent)", marginTop: "5px" }}>{error}</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px",
  border: "1.5px solid var(--color-border)", borderRadius: "9px",
  fontSize: "13px", fontFamily: "var(--font-body)",
  color: "var(--color-ink)", background: "white", outline: "none",
};

export function ShipmentForm({ shipment }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setErrors({});
      const result = shipment ? await updateShipment(shipment.id, formData) : await createShipment(formData);
      if ("error" in result && result.error) {
        toast.error(result.error);
        if ("details" in result && result.details) {
          setErrors((result.details as any).fieldErrors ?? {});
        }
        return;
      }
      toast.success(shipment ? "Shipment updated" : "Shipment created");
      if (!shipment && "shipment" in result && result.shipment) {
        router.push(`/dashboard/shipments/${result.shipment.id}`);
      }
    });
  }

  const err = (name: string) => errors[name]?.[0];

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        {/* Sender */}
        <section>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--color-ink)", letterSpacing: "-0.01em", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--color-border)" }}>
            Sender
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Field label="Full name" required error={err("sender_name")}>
              <input name="sender_name" required defaultValue={shipment?.sender_name} placeholder="John Doe" style={inputStyle} />
            </Field>
            <Field label="Email" required error={err("sender_email")}>
              <input name="sender_email" type="email" required defaultValue={shipment?.sender_email} placeholder="john@example.com" style={inputStyle} />
            </Field>
            <Field label="Phone">
              <input name="sender_phone" defaultValue={shipment?.sender_phone} placeholder="+234 800 000 0000" style={inputStyle} />
            </Field>
            <Field label="Address" required error={err("sender_address")}>
              <textarea name="sender_address" required defaultValue={shipment?.sender_address} rows={3} placeholder="Street, City, State" style={{ ...inputStyle, resize: "none" }} />
            </Field>
          </div>
        </section>

        {/* Receiver */}
        <section>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--color-ink)", letterSpacing: "-0.01em", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--color-border)" }}>
            Receiver
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Field label="Full name" required error={err("receiver_name")}>
              <input name="receiver_name" required defaultValue={shipment?.receiver_name} placeholder="Jane Smith" style={inputStyle} />
            </Field>
            <Field label="Email" required error={err("receiver_email")}>
              <input name="receiver_email" type="email" required defaultValue={shipment?.receiver_email} placeholder="jane@example.com" style={inputStyle} />
            </Field>
            <Field label="Phone">
              <input name="receiver_phone" defaultValue={shipment?.receiver_phone} placeholder="+234 800 000 0000" style={inputStyle} />
            </Field>
            <Field label="Address" required error={err("receiver_address")}>
              <textarea name="receiver_address" required defaultValue={shipment?.receiver_address} rows={3} placeholder="Street, City, State" style={{ ...inputStyle, resize: "none" }} />
            </Field>
          </div>
        </section>
      </div>

      {/* Package */}
      <section style={{ marginTop: "28px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--color-ink)", letterSpacing: "-0.01em", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--color-border)" }}>
          Package Details
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          <Field label="Weight (kg)">
            <input name="weight" type="number" step="0.01" min="0" defaultValue={shipment?.weight} placeholder="0.00" style={inputStyle} />
          </Field>
          <Field label="Dimensions">
            <input name="dimensions" defaultValue={shipment?.dimensions} placeholder="30 × 20 × 15 cm" style={inputStyle} />
          </Field>
          <Field label="Est. Delivery">
            <input name="estimated_delivery" type="date" defaultValue={shipment?.estimated_delivery} min={new Date().toISOString().split("T")[0]} style={inputStyle} />
          </Field>
          <Field label="Contents" >
            <input name="description" defaultValue={shipment?.description} placeholder="Electronics, Documents…" style={{ ...inputStyle, gridColumn: "span 2" }} />
          </Field>
          <div style={{ gridColumn: "span 3" }}>
            <Field label="Internal notes">
              <textarea name="notes" defaultValue={shipment?.notes} rows={2} placeholder="Fragile, special handling…" style={{ ...inputStyle, resize: "none" }} />
            </Field>
          </div>
        </div>
      </section>

      <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--color-border)", display: "flex", gap: "10px" }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: "11px 24px", background: "var(--color-ink)", color: "white",
            border: "none", borderRadius: "9px", fontSize: "13px", fontWeight: 700,
            fontFamily: "var(--font-display)", cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.6 : 1, letterSpacing: "-0.01em",
          }}
        >
          {isPending ? (shipment ? "Saving…" : "Creating…") : (shipment ? "Save Changes" : "Create Shipment")}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: "11px 18px", background: "white", color: "var(--color-ink)",
            border: "1.5px solid var(--color-border)", borderRadius: "9px",
            fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
