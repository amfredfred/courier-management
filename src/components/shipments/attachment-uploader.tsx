"use client";

import { useState, useTransition, useRef } from "react";
import { uploadAttachment, deleteAttachment } from "@/lib/actions/attachments";
import type { Attachment } from "@/types";
import { Upload, Trash2, FileText, File, FileImage } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props { shipmentId: string; attachments: Attachment[] }

function FileIcon({ type }: { type?: string }) {
  if (type?.startsWith("image/")) return <FileImage size={14} color="#b8b8b2" />;
  if (type?.includes("pdf")) return <FileText size={14} color="#b8b8b2" />;
  return <File size={14} color="#b8b8b2" />;
}

export function AttachmentUploader({ shipmentId, attachments }: Props) {
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("file", file);
      const r = await uploadAttachment(shipmentId, fd);
      if (r.error) toast.error(r.error);
      else toast.success("File uploaded");
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  function handleDelete(att: Attachment) {
    startTransition(async () => {
      const r = await deleteAttachment(att.id, att.file_url, shipmentId);
      if (r.error) toast.error(r.error);
      else toast.success("File removed");
    });
  }

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--color-ink)", letterSpacing: "-0.01em" }}>
          Attachments {attachments.length > 0 && <span style={{ color: "var(--color-ink-muted)", fontWeight: 400 }}>({attachments.length})</span>}
        </p>
        <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleUpload} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "7px 12px", border: "1.5px solid var(--color-border)",
            borderRadius: "8px", background: "white", cursor: "pointer",
            fontSize: "12px", fontWeight: 600, color: "var(--color-ink-muted)",
            fontFamily: "var(--font-body)", opacity: isPending ? 0.5 : 1,
          }}
        >
          <Upload size={12} />
          {isPending ? "Uploading…" : "Upload"}
        </button>
      </div>

      {attachments.length === 0 ? (
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: "1.5px dashed var(--color-border)", borderRadius: "10px",
            padding: "28px", textAlign: "center", cursor: "pointer",
            transition: "border-color 0.2s",
          }}
        >
          <Upload size={20} color="#d0d0cc" style={{ margin: "0 auto 8px" }} />
          <p style={{ fontSize: "12px", color: "#c0c0b8" }}>Click to upload images, PDFs, or documents</p>
          <p style={{ fontSize: "11px", color: "#d0d0c8", marginTop: "3px" }}>Max 10MB per file</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {attachments.map((att) => (
            <div key={att.id} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px",
              background: "var(--color-surface)", borderRadius: "9px",
              border: "1px solid var(--color-border)",
            }}>
              {att.file_type?.startsWith("image/") ? (
                <div style={{ width: "36px", height: "36px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "#e8e8e4" }}>
                  <img src={att.file_url} alt={att.file_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "white", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileIcon type={att.file_type} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.file_name}</p>
                <p style={{ fontSize: "11px", color: "#b8b8b2", marginTop: "1px" }}>
                  {att.file_size ? formatFileSize(att.file_size) : ""} · {formatDate(att.created_at)}
                </p>
              </div>
              <a href={att.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "var(--color-accent)", fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
                View
              </a>
              <button onClick={() => handleDelete(att)} style={{ background: "none", border: "none", cursor: "pointer", color: "#d0d0c8", padding: "2px", flexShrink: 0, display: "flex" }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
