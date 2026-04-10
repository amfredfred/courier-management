import { getShipments } from "@/lib/actions/shipments";
import { ShipmentsTable } from "@/components/shipments/shipments-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { ShipmentStatus } from "@/types";

interface PageProps {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}

export default async function ShipmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const status = params.status as ShipmentStatus | undefined;
  const search = params.search;
  const limit = 20;

  const { shipments, total } = await getShipments({ status, search, page, limit });
  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: "36px 40px", fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.03em", marginBottom: "4px" }}>
            Shipments
          </h1>
          <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", fontWeight: 300 }}>
            {total} total
          </p>
        </div>
        <Link href="/dashboard/shipments/new" style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          padding: "10px 18px",
          background: "var(--color-ink)", color: "white",
          borderRadius: "10px", textDecoration: "none",
          fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-display)",
          letterSpacing: "-0.01em",
        }}>
          <Plus size={14} strokeWidth={2.5} />
          New shipment
        </Link>
      </div>

      <ShipmentsTable
        shipments={shipments}
        total={total}
        page={page}
        totalPages={totalPages}
        currentStatus={status ?? ""}
        currentSearch={search ?? ""}
      />
    </div>
  );
}
