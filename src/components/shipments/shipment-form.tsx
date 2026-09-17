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
      <label className={`block text-[11px] font-bold tracking-[0.08em] uppercase mb-[7px] ${error ? "text-[var(--color-accent)]" : "text-[var(--color-ink-muted)]"}`}>
        {label}{required && <span className="text-[var(--color-accent)] ml-[3px]">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-[var(--color-accent)] mt-[5px]">{error}</p>}
    </div>
  );
}

const inputClass = "w-full py-2.5 px-3 border-[1.5px] border-[var(--color-border)] rounded-[9px] text-[13px] text-[var(--color-ink)] bg-white outline-none";
const sectionHeadingClass = "font-bold text-[13px] text-[var(--color-ink)] tracking-[-0.01em] mb-4 pb-2.5 border-b border-[var(--color-border)]";

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
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-8">
        {/* Sender */}
        <section>
          <p className={sectionHeadingClass}>
            Sender
          </p>
          <div className="flex flex-col gap-3.5">
            <Field label="Full name" required error={err("sender_name")}>
              <input name="sender_name" required defaultValue={shipment?.sender_name} placeholder="John Doe" className={inputClass} />
            </Field>
            <Field label="Email" required error={err("sender_email")}>
              <input name="sender_email" type="email" required defaultValue={shipment?.sender_email} placeholder="john@example.com" className={inputClass} />
            </Field>
            <Field label="Phone">
              <input name="sender_phone" defaultValue={shipment?.sender_phone} placeholder="+234 800 000 0000" className={inputClass} />
            </Field>
            <Field label="Address" required error={err("sender_address")}>
              <textarea name="sender_address" required defaultValue={shipment?.sender_address} rows={3} placeholder="Street, City, State" className={`${inputClass} resize-none`} />
            </Field>
          </div>
        </section>

        {/* Receiver */}
        <section>
          <p className={sectionHeadingClass}>
            Receiver
          </p>
          <div className="flex flex-col gap-3.5">
            <Field label="Full name" required error={err("receiver_name")}>
              <input name="receiver_name" required defaultValue={shipment?.receiver_name} placeholder="Jane Smith" className={inputClass} />
            </Field>
            <Field label="Email" required error={err("receiver_email")}>
              <input name="receiver_email" type="email" required defaultValue={shipment?.receiver_email} placeholder="jane@example.com" className={inputClass} />
            </Field>
            <Field label="Phone">
              <input name="receiver_phone" defaultValue={shipment?.receiver_phone} placeholder="+234 800 000 0000" className={inputClass} />
            </Field>
            <Field label="Address" required error={err("receiver_address")}>
              <textarea name="receiver_address" required defaultValue={shipment?.receiver_address} rows={3} placeholder="Street, City, State" className={`${inputClass} resize-none`} />
            </Field>
          </div>
        </section>
      </div>

      {/* Package */}
      <section className="mt-7">
        <p className={sectionHeadingClass}>
          Package Details
        </p>
        <div className="grid grid-cols-3 gap-3.5">
          <Field label="Weight (kg)">
            <input name="weight" type="number" step="0.01" min="0" defaultValue={shipment?.weight} placeholder="0.00" className={inputClass} />
          </Field>
          <Field label="Dimensions">
            <input name="dimensions" defaultValue={shipment?.dimensions} placeholder="30 × 20 × 15 cm" className={inputClass} />
          </Field>
          <Field label="Est. Delivery">
            <input name="estimated_delivery" type="date" defaultValue={shipment?.estimated_delivery} min={new Date().toISOString().split("T")[0]} className={inputClass} />
          </Field>
          <Field label="Contents" >
            <input name="description" defaultValue={shipment?.description} placeholder="Electronics, Documents…" className={`${inputClass} col-span-2`} />
          </Field>
          <div className="col-span-3">
            <Field label="Internal notes">
              <textarea name="notes" defaultValue={shipment?.notes} rows={2} placeholder="Fragile, special handling…" className={`${inputClass} resize-none`} />
            </Field>
          </div>
        </div>
      </section>

      <div className="mt-7 pt-5 border-t border-[var(--color-border)] flex gap-2.5">
        <button
          type="submit"
          disabled={isPending}
          className="py-[11px] px-6 bg-[var(--color-ink)] text-white border-none rounded-[9px] text-[13px] font-bold tracking-[-0.01em] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (shipment ? "Saving…" : "Creating…") : (shipment ? "Save Changes" : "Create Shipment")}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="py-[11px] px-[18px] bg-white text-[var(--color-ink)] border-[1.5px] border-[var(--color-border)] rounded-[9px] text-[13px] font-semibold cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
