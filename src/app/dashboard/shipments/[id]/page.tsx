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

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:          { bg: "#f5f5f3", color: "#6b6b6b",  label: "Pending" },
  picked_up:        { bg: "#eff6ff", color: "#1d4ed8",  label: "Picked Up" },
  in_transit:       { bg: "#f0f0ff", color: "#4338ca",  label: "In Transit" },
  out_for_delivery: { bg: "#fdf4ff", color: "#7e22ce",  label: "Out for Delivery" },
  delivered:        { bg: "#f0faf4", color: "#16a34a",  label: "Delivered" },
  failed_delivery:  { bg: "#fff4f1", color: "#c8410a",  label: "Delivery Failed" },
  returned:         { bg: "#fff7ed", color: "#c2410c",  label: "Returned" },
  cancelled:        { bg: "#f5f5f3", color: "#6b6b6b",  label: "Cancelled" },
};

export default async function ShipmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  let shipment;
  try { shipment = await getShipmentById(id); }
  catch { notFound(); }

  const st = STATUS_STYLE[shipment.status] ?? STATUS_STYLE.pending;

  return (
    <div style={{ padding: "36px 40px", fontFamily: "var(--font-body)", maxWidth: "1100px" }}>
      {/* Back */}
      <Link href="/dashboard/shipments" style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        fontSize: "12px", color: "var(--color-ink-muted)", textDecoration: "none",
        marginBottom: "24px", fontWeight: 500,
      }}>
        <ArrowLeft size={13} /> Back to shipments
      </Link>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: "monospace", fontSize: "20px", fontWeight: 700, color: "var(--color-ink)", letterSpacing: "0.04em" }}>
              {shipment.tracking_id}
            </h1>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", background: st.bg, borderRadius: "100px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.color }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: st.color, fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}>{st.label}</span>
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#b8b8b2" }}>Created {formatDate(shipment.created_at)}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <StatusUpdateClient shipmentId={shipment.id} currentStatus={shipment.status} />
          <Link href={`/dashboard/shipments/${shipment.id}/edit`} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "8px 14px",
            border: "1px solid var(--color-border)", borderRadius: "9px",
            fontSize: "12px", fontWeight: 600, color: "var(--color-ink)",
            textDecoration: "none", fontFamily: "var(--font-body)",
          }}>
            <Edit size={12} /> Edit
          </Link>
          <DeleteButton shipmentId={shipment.id} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px" }}>
        {/* Main col */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Route card */}
          <Card>
            <Row>
              <Half label="Sender">
                <strong>{shipment.sender_name}</strong>
                <Muted>{shipment.sender_email}</Muted>
                {shipment.sender_phone && <Muted>{shipment.sender_phone}</Muted>}
                <Muted style={{ marginTop: "6px" }}>{shipment.sender_address}</Muted>
              </Half>
              <div style={{ width: "1px", background: "var(--color-border)", alignSelf: "stretch" }} />
              <Half label="Receiver">
                <strong>{shipment.receiver_name}</strong>
                <Muted>{shipment.receiver_email}</Muted>
                {shipment.receiver_phone && <Muted>{shipment.receiver_phone}</Muted>}
                <Muted style={{ marginTop: "6px" }}>{shipment.receiver_address}</Muted>
              </Half>
            </Row>
          </Card>

          {/* Package details */}
          <Card title="Package">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <Detail label="Weight" value={shipment.weight ? `${shipment.weight} kg` : "—"} />
              <Detail label="Dimensions" value={shipment.dimensions ?? "—"} />
              <Detail label="Est. Delivery" value={shipment.estimated_delivery ? formatDateShort(shipment.estimated_delivery) : "—"} />
              {shipment.description && <Detail label="Contents" value={shipment.description} style={{ gridColumn: "span 3" }} />}
              {shipment.notes && <Detail label="Notes" value={shipment.notes} style={{ gridColumn: "span 3" }} />}
            </div>
          </Card>

          {/* Attachments */}
          <Card>
            <AttachmentUploader shipmentId={shipment.id} attachments={shipment.attachments ?? []} />
          </Card>
        </div>

        {/* Sidebar col */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Public link */}
          <div style={{ background: "#fff8f5", border: "1px solid #fde0d0", borderRadius: "14px", padding: "16px 18px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "8px" }}>
              Customer Tracking Link
            </p>
            <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#9a4020", wordBreak: "break-all", marginBottom: "10px" }}>
              /?track={shipment.tracking_id}
            </p>
            <Link href={`/?track=${shipment.tracking_id}`} target="_blank" style={{
              fontSize: "12px", color: "var(--color-accent)", fontWeight: 600, textDecoration: "none",
            }}>
              Open tracking page →
            </Link>
          </div>

          {/* Timeline */}
          <Card title="History">
            {(shipment.tracking_events?.length ?? 0) > 0 ? (
              <TrackingTimeline events={shipment.tracking_events!} currentStatus={shipment.status} />
            ) : (
              <p style={{ fontSize: "13px", color: "var(--color-ink-muted)" }}>No events yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div style={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "14px", padding: "20px" }}>
      {title && <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "16px", letterSpacing: "-0.01em" }}>{title}</p>}
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: "20px" }}>{children}</div>;
}

function Half({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "10px" }}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "13px", color: "var(--color-ink)" }}>{children}</div>
    </div>
  );
}

function Muted({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <span style={{ color: "var(--color-ink-muted)", fontWeight: 300, ...style }}>{children}</span>;
}

function Detail({ label, value, style }: { label: string; value: string; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-ink)" }}>{value}</p>
    </div>
  );
}
