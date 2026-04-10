"use client";

import { useRef } from "react";
import { Search } from "lucide-react";

export function TrackingSearchForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      method="GET"
      action="/"
      style={{ display: "flex", gap: "10px", maxWidth: "560px", margin: "0 auto" }}
    >
      <div style={{ flex: 1, position: "relative" }}>
        <Search
          size={15}
          style={{
            position: "absolute",
            left: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#c0c0b8",
            pointerEvents: "none",
          }}
        />
        <input
          ref={inputRef}
          name="track"
          autoFocus
          placeholder="e.g. CMS-LK9A3F-XZ7K"
          style={{
            width: "100%",
            padding: "14px 16px 14px 42px",
            border: "2px solid var(--color-border)",
            borderRadius: "12px",
            fontSize: "15px",
            fontFamily: "var(--font-body)",
            color: "var(--color-ink)",
            background: "white",
            outline: "none",
            letterSpacing: "0.02em",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--color-ink)";
            e.target.style.boxShadow = "0 0 0 4px rgba(13,13,13,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "14px 26px",
          background: "var(--color-ink)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          cursor: "pointer",
          whiteSpace: "nowrap",
          letterSpacing: "-0.02em",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.opacity = "0.85"; }}
        onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.opacity = "1"; }}
      >
        Track
      </button>
    </form>
  );
}
