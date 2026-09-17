import { ShipmentForm } from "@/components/shipments/shipment-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewShipmentPage() {
  return (
    <div className="p-10 max-w-[900px]">
      <Link href="/dashboard/shipments" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)] no-underline mb-6 font-medium">
        <ArrowLeft size={13} /> Back
      </Link>
      <h1 className="font-extrabold text-[22px] text-[var(--color-ink)] tracking-[-0.03em] mb-1">
        New Shipment
      </h1>
      <p className="text-[13px] text-[var(--color-ink-muted)] mb-8 font-light">
        A unique tracking ID will be generated automatically.
      </p>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
        <ShipmentForm />
      </div>
    </div>
  );
}
