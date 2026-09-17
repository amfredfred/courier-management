export function BrandLogo({ size = 30 }: { size?: number }) {
  return (
    <div
      className="bg-[var(--color-accent)] flex items-center justify-center shrink-0"
      // Computed from a runtime `size` prop — can't be a static Tailwind class.
      style={{ width: size, height: size, borderRadius: size * 0.27 }}
    >
      <svg width={size * 0.47} height={size * 0.47} fill="none" viewBox="0 0 24 24">
        <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="21" r="1" fill="white" stroke="white" />
        <circle cx="20" cy="21" r="1" fill="white" stroke="white" />
      </svg>
    </div>
  );
}
