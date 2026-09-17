import { getShipmentById } from "@/lib/actions/shipments";
import { ShipmentForm } from "@/components/shipments/shipment-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps { params: Promise<{ id: string }> }

export default async function EditShipmentPage({ params }: PageProps) {
  const { id } = await params;
  let shipment;
  try { shipment = await getShipmentById(id); }
  catch { notFound(); }

  return (
    <div className="p-10 max-w-[900px]">
      <Link href={`/dashboard/shipments/${id}`} className="inline-flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)] no-underline mb-6 font-medium">
        <ArrowLeft size={13} /> Back to shipment
      </Link>
      <h1 className="font-extrabold text-[22px] text-[var(--color-ink)] tracking-[-0.03em] mb-1">
        Edit Shipment
      </h1>
      <p className="font-mono text-xs text-[var(--color-ink-muted)] mb-8">
        {shipment.tracking_id}
      </p>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
        <ShipmentForm shipment={shipment} />
      </div>
    </div>
  );
}
