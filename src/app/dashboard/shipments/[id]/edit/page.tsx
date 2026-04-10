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
    <div style={{ padding: "36px 40px", maxWidth: "900px", fontFamily: "var(--font-body)" }}>
      <Link href={`/dashboard/shipments/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-ink-muted)", textDecoration: "none", marginBottom: "24px", fontWeight: 500 }}>
        <ArrowLeft size={13} /> Back to shipment
      </Link>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.03em", marginBottom: "4px" }}>
        Edit Shipment
      </h1>
      <p style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--color-ink-muted)", marginBottom: "28px" }}>
        {shipment.tracking_id}
      </p>
      <div style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "28px" }}>
        <ShipmentForm shipment={shipment} />
      </div>
    </div>
  );
}
