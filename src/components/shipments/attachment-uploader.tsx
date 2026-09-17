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
    <div>
      <div className="flex items-center justify-between mb-3.5">
        <p className="font-bold text-[13px] text-[var(--color-ink)] tracking-[-0.01em]">
          Attachments {attachments.length > 0 && <span className="text-[var(--color-ink-muted)] font-normal">({attachments.length})</span>}
        </p>
        <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleUpload} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 py-[7px] px-3 border-[1.5px] border-[var(--color-border)] rounded-lg bg-white cursor-pointer text-xs font-semibold text-[var(--color-ink-muted)] disabled:opacity-50"
        >
          <Upload size={12} />
          {isPending ? "Uploading…" : "Upload"}
        </button>
      </div>

      {attachments.length === 0 ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-[1.5px] border-dashed border-[var(--color-border)] rounded-[10px] p-7 text-center cursor-pointer transition-colors duration-200"
        >
          <Upload size={20} color="#d0d0cc" className="mx-auto mb-2" />
          <p className="text-xs text-[#c0c0b8]">Click to upload images, PDFs, or documents</p>
          <p className="text-[11px] text-[#d0d0c8] mt-[3px]">Max 10MB per file</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {attachments.map((att) => (
            <div key={att.id} className="flex items-center gap-2.5 py-2.5 px-3 bg-[var(--color-surface)] rounded-[9px] border border-[var(--color-border)]">
              {att.file_type?.startsWith("image/") ? (
                <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 bg-[#e8e8e4]">
                  <img src={att.file_url} alt={att.file_name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-md bg-white border border-[var(--color-border)] flex items-center justify-center shrink-0">
                  <FileIcon type={att.file_type} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--color-ink)] overflow-hidden text-ellipsis whitespace-nowrap">{att.file_name}</p>
                <p className="text-[11px] text-[#b8b8b2] mt-px">
                  {att.file_size ? formatFileSize(att.file_size) : ""} · {formatDate(att.created_at)}
                </p>
              </div>
              <a href={att.file_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[var(--color-accent)] font-semibold no-underline shrink-0">
                View
              </a>
              <button onClick={() => handleDelete(att)} className="bg-transparent border-none cursor-pointer text-[#d0d0c8] p-0.5 shrink-0 flex">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
