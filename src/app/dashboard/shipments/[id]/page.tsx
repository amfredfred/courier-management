import { getShipmentById } from "@/lib/actions/shipments";
import { TrackingTimeline } from "@/components/tracking/timeline";
import { AttachmentUploader } from "@/components/shipments/attachment-uploader";
import { DeleteButton } from "@/components/shipments/delete-button";
import { StatusUpdateClient } from "@/components/shipments/status-update-client";
import { formatDate, formatDateShort } from "@/lib/utils";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps { params: Promise<{ id: string }> }

const STATUS_STYLE: Record<string, { bg: string; dot: string; text: string; label: string }> = {
  pending:          { bg: "bg-[#f5f5f3]", dot: "bg-[#6b6b6b]", text: "text-[#6b6b6b]", label: "Pending" },
  picked_up:        { bg: "bg-[#eff6ff]", dot: "bg-[#1d4ed8]", text: "text-[#1d4ed8]", label: "Picked Up" },
  in_transit:       { bg: "bg-[#f0f0ff]", dot: "bg-[#4338ca]", text: "text-[#4338ca]", label: "In Transit" },
  out_for_delivery: { bg: "bg-[#fdf4ff]", dot: "bg-[#7e22ce]", text: "text-[#7e22ce]", label: "Out for Delivery" },
  delivered:        { bg: "bg-[#f0faf4]", dot: "bg-[#16a34a]", text: "text-[#16a34a]", label: "Delivered" },
  failed_delivery:  { bg: "bg-[#fff4f1]", dot: "bg-[#c8410a]", text: "text-[#c8410a]", label: "Delivery Failed" },
  returned:         { bg: "bg-[#fff7ed]", dot: "bg-[#c2410c]", text: "text-[#c2410c]", label: "Returned" },
  cancelled:        { bg: "bg-[#f5f5f3]", dot: "bg-[#6b6b6b]", text: "text-[#6b6b6b]", label: "Cancelled" },
};

export default async function ShipmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  let shipment;
  try { shipment = await getShipmentById(id); }
  catch { notFound(); }

  const st = STATUS_STYLE[shipment.status] ?? STATUS_STYLE.pending;

  return (
    <div className="p-10 max-w-[1100px]">
      {/* Back */}
      <Link href="/dashboard/shipments" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)] no-underline mb-6 font-medium">
        <ArrowLeft size={13} /> Back to shipments
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h1 className="font-mono text-xl font-bold text-[var(--color-ink)] tracking-[0.04em]">
              {shipment.tracking_id}
            </h1>
            <span className={`inline-flex items-center gap-[5px] py-1 px-2.5 rounded-full ${st.bg}`}>
              <div className={`w-[5px] h-[5px] rounded-full ${st.dot}`} />
              <span className={`text-[11px] font-semibold tracking-[0.02em] ${st.text}`}>{st.label}</span>
            </span>
          </div>
          <p className="text-xs text-[#b8b8b2]">Created {formatDate(shipment.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusUpdateClient shipmentId={shipment.id} currentStatus={shipment.status} />
          <Link
            href={`/dashboard/shipments/${shipment.id}/edit`}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 border border-[var(--color-border)] rounded-[9px] text-xs font-semibold text-[var(--color-ink)] no-underline"
          >
            <Edit size={12} /> Edit
          </Link>
          <DeleteButton shipmentId={shipment.id} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-[1fr_340px]">
        {/* Main col */}
        <div className="flex flex-col gap-3.5">
          {/* Route card */}
          <Card>
            <Row>
              <Half label="Sender">
                <strong>{shipment.sender_name}</strong>
                <Muted>{shipment.sender_email}</Muted>
                {shipment.sender_phone && <Muted>{shipment.sender_phone}</Muted>}
                <Muted className="mt-1.5">{shipment.sender_address}</Muted>
              </Half>
              <div className="w-px bg-[var(--color-border)] self-stretch" />
              <Half label="Receiver">
                <strong>{shipment.receiver_name}</strong>
                <Muted>{shipment.receiver_email}</Muted>
                {shipment.receiver_phone && <Muted>{shipment.receiver_phone}</Muted>}
                <Muted className="mt-1.5">{shipment.receiver_address}</Muted>
              </Half>
            </Row>
          </Card>

          {/* Package details */}
          <Card title="Package">
            <div className="grid grid-cols-3 gap-4">
              <Detail label="Weight" value={shipment.weight ? `${shipment.weight} kg` : "—"} />
              <Detail label="Dimensions" value={shipment.dimensions ?? "—"} />
              <Detail label="Est. Delivery" value={shipment.estimated_delivery ? formatDateShort(shipment.estimated_delivery) : "—"} />
              {shipment.description && <Detail label="Contents" value={shipment.description} className="col-span-3" />}
              {shipment.notes && <Detail label="Notes" value={shipment.notes} className="col-span-3" />}
            </div>
          </Card>

          {/* Attachments */}
          <Card>
            <AttachmentUploader shipmentId={shipment.id} attachments={shipment.attachments ?? []} />
          </Card>
        </div>

        {/* Sidebar col */}
        <div className="flex flex-col gap-3.5">
          {/* Public link */}
          <div className="bg-[#fff8f5] border border-[#fde0d0] rounded-2xl py-5 px-6">
            <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--color-accent)] mb-2">
              Customer Tracking Link
            </p>
            <p className="font-mono text-[11px] text-[#9a4020] break-all mb-2.5">
              /?track={shipment.tracking_id}
            </p>
            <Link href={`/?track=${shipment.tracking_id}`} target="_blank" className="text-xs text-[var(--color-accent)] font-semibold no-underline">
              Open tracking page →
            </Link>
          </div>

          {/* Timeline */}
          <Card title="History">
            {(shipment.tracking_events?.length ?? 0) > 0 ? (
              <TrackingTimeline events={shipment.tracking_events!} currentStatus={shipment.status} />
            ) : (
              <p className="text-[13px] text-[var(--color-ink-muted)]">No events yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
      {title && <p className="font-bold text-[13px] text-[var(--color-ink)] mb-4 tracking-[-0.01em]">{title}</p>}
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-5">{children}</div>;
}

function Half({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--color-ink-muted)] mb-2.5">{label}</p>
      <div className="flex flex-col gap-0.5 text-[13px] text-[var(--color-ink)]">{children}</div>
    </div>
  );
}

function Muted({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-[var(--color-ink-muted)] font-light ${className}`}>{children}</span>;
}

function Detail({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--color-ink-muted)] mb-1">{label}</p>
      <p className="text-[13px] font-medium text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
