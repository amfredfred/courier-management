"use client";

import { useRef } from "react";
import { Search } from "lucide-react";

export function TrackingSearchForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form method="GET" action="/" className="flex gap-2.5 max-w-[560px] mx-auto">
      <div className="flex-1 relative">
        <Search
          size={15}
          className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#c0c0b8] pointer-events-none"
        />
        <input
          ref={inputRef}
          name="track"
          autoFocus
          placeholder="e.g. CMS-LK9A3F-XZ7K"
          className="w-full py-3.5 pr-4 pl-[42px] border-2 border-[var(--color-border)] rounded-xl text-[15px] text-[var(--color-ink)] bg-white outline-none tracking-[0.02em] transition-[border-color,box-shadow] duration-200 focus:border-[var(--color-ink)] focus:shadow-[0_0_0_4px_rgba(13,13,13,0.06)]"
        />
      </div>
      <button
        type="submit"
        className="py-3.5 px-[26px] bg-[var(--color-ink)] text-white border-none rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap tracking-[-0.02em] transition-opacity duration-150 hover:opacity-85"
      >
        Track
      </button>
    </form>
  );
}
