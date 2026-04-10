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
  pending: "#9ca3af", picked_up: "#3b82f6", in_transit: "#6366f1",
  out_for_delivery: "#8b5cf6", delivered: "#16a34a",
  failed_delivery: "#dc2626", returned: "#ea580c", cancelled: "#9ca3af",
};

const inputStyle: React.CSSProperties = {
  padding: "9px 12px 9px 36px",
  border: "1.5px solid var(--color-border)",
  borderRadius: "9px",
  fontSize: "13px",
  fontFamily: "var(--font-body)",
  color: "var(--color-ink)",
  background: "white",
  outline: "none",
  width: "100%",
};

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
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#b8b8b2", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking ID, name, email…"
            style={inputStyle}
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "9px 12px", border: "1.5px solid var(--color-border)", borderRadius: "9px", fontSize: "13px", fontFamily: "var(--font-body)", color: "var(--color-ink)", background: "white", outline: "none", cursor: "pointer" }}
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setStatus(""); }}
            style={{ padding: "9px 12px", border: "1.5px solid var(--color-border)", borderRadius: "9px", fontSize: "12px", fontWeight: 600, color: "var(--color-ink-muted)", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}
          >
            <X size={12} /> Clear
          </button>
        )}

        <a
          href={`/api/export${hasFilters ? `?${new URLSearchParams({ ...(search ? { search } : {}), ...(status ? { status } : {}) })}` : ""}`}
          style={{ padding: "9px 14px", border: "1.5px solid var(--color-border)", borderRadius: "9px", fontSize: "12px", fontWeight: 600, color: "var(--color-ink-muted)", background: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}
        >
          <Download size={13} /> Export CSV
        </a>
      </div>

      {/* Table */}
      <div style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "16px", overflow: "hidden" }}>
        {shipments.length === 0 ? (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Package size={22} color="#b8b8b2" strokeWidth={1.5} />
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "6px" }}>
              {hasFilters ? "No results" : "No shipments yet"}
            </p>
            <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", marginBottom: "20px", fontWeight: 300 }}>
              {hasFilters ? "Try different filters." : "Create your first shipment to get started."}
            </p>
            {!hasFilters && (
              <Link href="/dashboard/shipments/new" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "9px 18px", background: "var(--color-ink)", color: "white",
                borderRadius: "9px", textDecoration: "none",
                fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-display)",
              }}>
                <Plus size={13} /> Create shipment
              </Link>
            )}
          </div>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-surface)" }}>
                  {["Tracking ID", "Receiver", "Status", "Est. Delivery", "Created", ""].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shipments.map((s, i) => {
                  const dot = STATUS_DOT[s.status] ?? "#9ca3af";
                  return (
                    <tr
                      key={s.id}
                      style={{ borderBottom: i < shipments.length - 1 ? "1px solid #fafaf8" : "none", transition: "background 0.1s" }}
                      className="hover:bg-gray-50"
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "var(--color-ink)", background: "var(--color-surface)", padding: "3px 8px", borderRadius: "5px", letterSpacing: "0.04em" }}>
                          {s.tracking_id}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <p style={{ fontWeight: 500, color: "var(--color-ink)", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.receiver_name}</p>
                        <p style={{ fontSize: "11px", color: "#b8b8b2", marginTop: "1px", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.receiver_email}</p>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dot, flexShrink: 0 }} />
                          <span style={{ color: "var(--color-ink-muted)", fontWeight: 500, whiteSpace: "nowrap" }}>{STATUS_LABELS[s.status]}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", color: "#b8b8b2", whiteSpace: "nowrap" }}>
                        {s.estimated_delivery ?? "—"}
                      </td>
                      <td style={{ padding: "14px 20px", color: "#b8b8b2", whiteSpace: "nowrap" }}>
                        {formatDate(s.created_at)}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "flex-end" }}>
                          <Link
                            href={`/dashboard/shipments/${s.id}`}
                            style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-ink)", textDecoration: "none", whiteSpace: "nowrap" }}
                          >
                            View →
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(s.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#d0d0c8", padding: "2px", display: "flex", alignItems: "center", transition: "color 0.15s" }}
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
              <div style={{ padding: "14px 20px", borderTop: "1px solid var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: "12px", color: "#b8b8b2" }}>
                  {shipments.length} of {total} shipments
                </p>
                <div style={{ display: "flex", gap: "4px" }}>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => pushQuery(search, status, p)}
                      style={{
                        width: "30px", height: "30px", borderRadius: "7px",
                        border: "1.5px solid",
                        borderColor: p === page ? "var(--color-ink)" : "transparent",
                        background: p === page ? "var(--color-ink)" : "transparent",
                        color: p === page ? "white" : "var(--color-ink-muted)",
                        fontSize: "12px", fontWeight: p === page ? 700 : 400,
                        cursor: "pointer", fontFamily: "var(--font-body)",
                        transition: "all 0.15s",
                      }}
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "16px" }}>
          <div style={{ background: "white", borderRadius: "18px", width: "100%", maxWidth: "360px", padding: "28px", fontFamily: "var(--font-body)", boxShadow: "0 24px 48px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "24px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fff4f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertTriangle size={18} color="var(--color-accent)" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "6px" }}>Delete shipment?</p>
                <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", fontWeight: 300, lineHeight: 1.5 }}>
                  All tracking history will be permanently removed.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleDelete} disabled={isPending} style={{ flex: 1, padding: "11px", background: "var(--color-accent)", color: "white", border: "none", borderRadius: "9px", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-display)", cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.6 : 1 }}>
                {isPending ? "Deleting…" : "Delete"}
              </button>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: "11px", background: "white", color: "var(--color-ink)", border: "1.5px solid var(--color-border)", borderRadius: "9px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
