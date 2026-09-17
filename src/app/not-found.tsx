import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-[80px] font-extrabold text-[var(--color-border)] leading-none mb-4 tracking-[-0.06em]">404</p>
        <h1 className="text-[22px] font-bold text-[var(--color-ink)] mb-2 tracking-[-0.02em]">
          Page not found
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)] mb-7 font-light">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 py-2.5 px-5 bg-[var(--color-ink)] text-white rounded-[10px] no-underline text-[13px] font-semibold"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
