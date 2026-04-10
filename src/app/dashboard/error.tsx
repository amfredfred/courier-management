"use client";

import { useEffect } from "react";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div style={{ padding: "64px 40px", fontFamily: "var(--font-body)" }}>
      <div style={{ maxWidth: "360px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "8px" }}>
          Something went wrong
        </p>
        <p style={{ fontSize: "13px", color: "var(--color-ink-muted)", marginBottom: "20px", fontWeight: 300 }}>
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          style={{ padding: "10px 20px", background: "var(--color-ink)", color: "white", border: "none", borderRadius: "9px", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-display)", cursor: "pointer" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
