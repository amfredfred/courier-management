import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "var(--font-body)" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "80px", fontWeight: 800, color: "var(--color-border)", lineHeight: 1, marginBottom: "16px", letterSpacing: "-0.06em" }}>404</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
          Page not found
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-ink-muted)", marginBottom: "28px", fontWeight: 300 }}>
          The page you're looking for doesn't exist.
        </p>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "10px 20px", background: "var(--color-ink)", color: "white",
          borderRadius: "10px", textDecoration: "none",
          fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-display)",
        }}>
          Go home
        </Link>
      </div>
    </div>
  );
}
