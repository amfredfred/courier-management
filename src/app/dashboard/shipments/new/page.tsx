import { ShipmentForm } from "@/components/shipments/shipment-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewShipmentPage() {
  return (
    <div style={{ padding: "36px 40px", maxWidth: "900px", fontFamily: "var(--font-body)" }}>
      <Link href="/dashboard/shipments" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-ink-muted)", textDecoration: "none", marginBottom: "24px", fontWeight: 500 }}>
        <ArrowLeft size={13} /> Back
      </Link>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.03em", marginBottom: "4px" }}>
        New Shipment
      </h1>
      <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", marginBottom: "28px", fontWeight: 300 }}>
        A unique tracking ID will be generated automatically.
      </p>
      <div style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "28px" }}>
        <ShipmentForm />
      </div>
    </div>
  );
}
