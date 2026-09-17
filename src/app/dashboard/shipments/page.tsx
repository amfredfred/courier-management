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
    <div className="p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-extrabold text-2xl text-[var(--color-ink)] tracking-[-0.03em] mb-1">
            Shipments
          </h1>
          <p className="text-[13px] text-[var(--color-ink-muted)] font-light">
            {total} total
          </p>
        </div>
        <Link
          href="/dashboard/shipments/new"
          className="inline-flex items-center gap-[7px] py-2.5 px-[18px] bg-[var(--color-ink)] text-white rounded-[10px] no-underline text-[13px] font-semibold tracking-[-0.01em]"
        >
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
