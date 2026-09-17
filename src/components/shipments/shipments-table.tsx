"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { deleteShipment } from "@/lib/actions/shipments";
import { formatDate } from "@/lib/utils";
import type { Shipment, ShipmentStatus } from "@/types";
import { STATUS_LABELS } from "@/types";
import { Search, Package, Trash2, Download, Plus, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks/use-debounce";
import toast from "react-hot-toast";

interface Props {
  shipments: Shipment[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus?: string;
  currentSearch?: string;
}

const STATUS_DOT: Record<string, string> = {
  pending: "bg-[#9ca3af]", picked_up: "bg-[#3b82f6]", in_transit: "bg-[#6366f1]",
  out_for_delivery: "bg-[#8b5cf6]", delivered: "bg-[#16a34a]",
  failed_delivery: "bg-[#dc2626]", returned: "bg-[#ea580c]", cancelled: "bg-[#9ca3af]",
};

const selectClass = "py-2.5 px-3 border-[1.5px] border-[var(--color-border)] rounded-[9px] text-[13px] text-[var(--color-ink)] bg-white outline-none cursor-pointer";

export function ShipmentsTable({ shipments, total, page, totalPages, currentStatus = "", currentSearch = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(currentSearch);
  const [status, setStatus] = useState(currentStatus);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const debouncedSearch = useDebounce(search, 400);

  const pushQuery = useCallback((s: string, st: string, p = 1) => {
    const params = new URLSearchParams();
    if (s) params.set("search", s);
    if (st) params.set("status", st);
    if (p > 1) params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname]);

  useEffect(() => { pushQuery(debouncedSearch, status); }, [debouncedSearch, status, pushQuery]);

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const r = await deleteShipment(deleteTarget);
      if (r.error) toast.error(r.error);
      else toast.success("Deleted");
      setDeleteTarget(null);
    });
  }

  const hasFilters = !!(search || status);

  return (
    <>
      {/* Toolbar */}
      <div className="flex gap-2.5 mb-4 items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#b8b8b2] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking ID, name, email…"
            className="py-2.5 pr-3 pl-9 border-[1.5px] border-[var(--color-border)] rounded-[9px] text-[13px] text-[var(--color-ink)] bg-white outline-none w-full"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectClass}
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setStatus(""); }}
            className="py-2.5 px-3 border-[1.5px] border-[var(--color-border)] rounded-[9px] text-xs font-semibold text-[var(--color-ink-muted)] bg-white cursor-pointer flex items-center gap-[5px] whitespace-nowrap"
          >
            <X size={12} /> Clear
          </button>
        )}

        <a
          href={`/api/export${hasFilters ? `?${new URLSearchParams({ ...(search ? { search } : {}), ...(status ? { status } : {}) })}` : ""}`}
          className="py-2.5 px-3.5 border-[1.5px] border-[var(--color-border)] rounded-[9px] text-xs font-semibold text-[var(--color-ink-muted)] bg-white no-underline flex items-center gap-1.5 whitespace-nowrap"
        >
          <Download size={13} /> Export CSV
        </a>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {shipments.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] flex items-center justify-center mx-auto mb-4">
              <Package size={22} color="#b8b8b2" strokeWidth={1.5} />
            </div>
            <p className="font-bold text-[15px] text-[var(--color-ink)] mb-1.5">
              {hasFilters ? "No results" : "No shipments yet"}
            </p>
            <p className="text-[13px] text-[var(--color-ink-muted)] mb-5 font-light">
              {hasFilters ? "Try different filters." : "Create your first shipment to get started."}
            </p>
            {!hasFilters && (
              <Link
                href="/dashboard/shipments/new"
                className="inline-flex items-center gap-1.5 py-2 px-[18px] bg-[var(--color-ink)] text-white rounded-[9px] no-underline text-[13px] font-semibold"
              >
                <Plus size={13} /> Create shipment
              </Link>
            )}
          </div>
        ) : (
          <>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[var(--color-surface)]">
                  {["Tracking ID", "Receiver", "Status", "Est. Delivery", "Created", ""].map((h) => (
                    <th key={h} className="text-left py-3 px-6 text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--color-ink-muted)] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shipments.map((s, i) => {
                  const dot = STATUS_DOT[s.status] ?? "bg-[#9ca3af]";
                  return (
                    <tr
                      key={s.id}
                      className={`transition-colors duration-100 hover:bg-gray-50 ${i < shipments.length - 1 ? "border-b border-[#fafaf8]" : "border-b-0"}`}
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold text-[var(--color-ink)] bg-[var(--color-surface)] py-[3px] px-2 rounded-[5px] tracking-[0.04em]">
                          {s.tracking_id}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-[var(--color-ink)] max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">{s.receiver_name}</p>
                        <p className="text-[11px] text-[#b8b8b2] mt-px max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">{s.receiver_email}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                          <span className="text-[var(--color-ink-muted)] font-medium whitespace-nowrap">{STATUS_LABELS[s.status]}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#b8b8b2] whitespace-nowrap">
                        {s.estimated_delivery ?? "—"}
                      </td>
                      <td className="py-4 px-6 text-[#b8b8b2] whitespace-nowrap">
                        {formatDate(s.created_at)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 justify-end">
                          <Link
                            href={`/dashboard/shipments/${s.id}`}
                            className="text-xs font-semibold text-[var(--color-ink)] no-underline whitespace-nowrap"
                          >
                            View →
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(s.id)}
                            className="bg-transparent border-none cursor-pointer text-[#d0d0c8] p-0.5 flex items-center transition-colors duration-150"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="py-4 px-6 border-t border-[var(--color-surface)] flex items-center justify-between">
                <p className="text-xs text-[#b8b8b2]">
                  {shipments.length} of {total} shipments
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => pushQuery(search, status, p)}
                      className={`w-[30px] h-[30px] rounded-[7px] border-[1.5px] text-xs cursor-pointer transition-all duration-150 ${
                        p === page
                          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white font-bold"
                          : "border-transparent bg-transparent text-[var(--color-ink-muted)] font-normal"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[18px] w-full max-w-[360px] p-7 shadow-[0_24px_48px_rgba(0,0,0,0.12)]">
            <div className="flex gap-3.5 items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-[#fff4f1] flex items-center justify-center shrink-0">
                <AlertTriangle size={18} color="var(--color-accent)" />
              </div>
              <div>
                <p className="font-bold text-[15px] text-[var(--color-ink)] mb-1.5">Delete shipment?</p>
                <p className="text-[13px] text-[var(--color-ink-muted)] font-light leading-normal">
                  All tracking history will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button onClick={handleDelete} disabled={isPending} className="flex-1 py-[11px] bg-[var(--color-accent)] text-white border-none rounded-[9px] text-[13px] font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60">
                {isPending ? "Deleting…" : "Delete"}
              </button>
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-[11px] bg-white text-[var(--color-ink)] border-[1.5px] border-[var(--color-border)] rounded-[9px] text-[13px] font-semibold cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
