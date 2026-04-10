import Link from "next/link";
import { getShipmentByTrackingId } from "@/lib/actions/shipments";
import { PublicTrackingResult } from "@/components/tracking/public-tracking-result";

interface PageProps {
  searchParams: Promise<{ track?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const trackingId = params.track?.trim().toUpperCase() ?? "";
  const shipment = trackingId ? await getShipmentByTrackingId(trackingId) : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-body)" }}>

      {/* Top nav — minimal */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "var(--color-accent)" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="21" r="1" fill="white" stroke="white"/>
              <circle cx="20" cy="21" r="1" fill="white" stroke="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px", color: "var(--color-ink)", letterSpacing: "-0.02em" }}>
            SwiftTrack
          </span>
        </div>
        <Link
          href="/login"
          style={{ fontSize: "13px", color: "var(--color-ink-muted)", fontWeight: 500 }}
          className="hover:opacity-70 transition-opacity"
        >
          Login
        </Link>
      </nav>

      {/* Hero — centered search */}
      <section
        className="flex-1 flex flex-col items-center justify-center px-4 py-20"
        style={{ background: "linear-gradient(180deg, #faf9f7 0%, #ffffff 100%)", minHeight: "100vh" }}
      >
        {!trackingId ? (
          <div className="w-full max-w-2xl text-center fade-up">
            {/* Eyebrow */}
            <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", color: "var(--color-accent)", textTransform: "uppercase", marginBottom: "20px" }}>
              Real-time shipment tracking
            </p>

            {/* Headline */}
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              marginBottom: "12px"
            }}>
              Where is your<br />
              <span style={{ color: "var(--color-accent)" }}>package?</span>
            </h1>

            <p style={{ fontSize: "16px", color: "var(--color-ink-muted)", fontWeight: 300, marginBottom: "40px" }}>
              Enter your tracking number to get the latest status.
            </p>

            {/* Search form */}
            <TrackingSearchForm />

            {/* Hint */}
            <p style={{ fontSize: "12px", color: "#b0b0a8", marginTop: "20px" }}>
              Your tracking number was included in your shipping confirmation email
            </p>
          </div>
        ) : (
          <div className="w-full max-w-3xl fade-up">
            {/* Back link */}
            <Link
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-ink-muted)", marginBottom: "32px", fontWeight: 500 }}
              className="hover:opacity-70 transition-opacity"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Track another shipment
            </Link>

            {shipment ? (
              <PublicTrackingResult shipment={shipment} />
            ) : (
              <NotFoundCard trackingId={trackingId} />
            )}
          </div>
        )}
      </section>

      {/* Footer — minimal */}
      <footer style={{ borderTop: "1px solid var(--color-border)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "12px", color: "#b0b0a8" }}>© 2025 SwiftTrack</span>
        <span style={{ fontSize: "12px", color: "#b0b0a8" }}>Courier & Logistics Management</span>
      </footer>
    </div>
  );
}

function TrackingSearchForm() {
  return (
    <form method="GET" action="/" style={{ display: "flex", gap: "10px", maxWidth: "560px", margin: "0 auto" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <svg
          width="16" height="16" fill="none" viewBox="0 0 24 24"
          style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#b0b0a8" }}
        >
          <path d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          name="track"
          placeholder="e.g. CMS-LK9A3F-XZ7K"
          autoFocus
          style={{
            width: "100%",
            padding: "14px 16px 14px 44px",
            border: "2px solid var(--color-border)",
            borderRadius: "12px",
            fontSize: "15px",
            fontFamily: "var(--font-body)",
            color: "var(--color-ink)",
            background: "white",
            outline: "none",
            letterSpacing: "0.02em",
            transition: "border-color 0.2s",
          }}
          // onFocus={(e) => { e.target.style.borderColor = "var(--color-accent)"; }}
          // onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "14px 24px",
          background: "var(--color-ink)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: "var(--font-display)",
          cursor: "pointer",
          whiteSpace: "nowrap",
          letterSpacing: "-0.01em",
          transition: "opacity 0.2s",
        }}
      >
        Track
      </button>
    </form>
  );
}

function NotFoundCard({ trackingId }: { trackingId: string }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid var(--color-border)",
      borderRadius: "20px",
      padding: "60px 40px",
      textAlign: "center",
    }}>
      <div style={{
        width: "56px", height: "56px",
        background: "#f5f5f3",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px"
      }}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M9.172 14.828L12 12m0 0l2.828-2.828M12 12L9.172 9.172M12 12l2.828 2.828M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#b0b0a8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "20px", color: "var(--color-ink)", marginBottom: "8px" }}>
        Shipment not found
      </p>
      <p style={{ fontSize: "14px", color: "var(--color-ink-muted)", marginBottom: "6px" }}>
        We couldn't find any shipment with tracking number
      </p>
      <p style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--color-accent)", fontWeight: 600 }}>
        {trackingId}
      </p>
      <p style={{ fontSize: "13px", color: "#b0b0a8", marginTop: "16px" }}>
        Please double-check your tracking number or contact the sender.
      </p>
    </div>
  );
}
