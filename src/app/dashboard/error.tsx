"use client";

import { useEffect } from "react";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="py-16 px-10">
      <div className="max-w-[360px]">
        <p className="text-xl font-bold text-[var(--color-ink)] mb-2">
          Something went wrong
        </p>
        <p className="text-[13px] text-[var(--color-ink-muted)] mb-5 font-light">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="py-2.5 px-5 bg-[var(--color-ink)] text-white border-none rounded-[9px] text-[13px] font-semibold cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
