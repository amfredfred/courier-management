import Link from "next/link";
import { getShipmentByTrackingId } from "@/lib/actions/shipments";
import { PublicTrackingResult } from "@/components/tracking/public-tracking-result";
import { TrackingSearchForm } from "@/components/tracking/tracking-search-form";

interface PageProps {
  searchParams: Promise<{ track?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const trackingId = params.track?.trim().toUpperCase() ?? "";
  const shipment = trackingId ? await getShipmentByTrackingId(trackingId) : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-body)", background: "#fafaf8" }}>

      {/* Top nav */}
      <nav style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: "var(--color-accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="21" r="1" fill="white" stroke="white"/>
              <circle cx="20" cy="21" r="1" fill="white" stroke="white"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px",
            color: "var(--color-ink)", letterSpacing: "-0.02em",
          }}>
            SwiftTrack
          </span>
        </div>
        <Link
          href="/login"
          style={{ fontSize: "13px", color: "var(--color-ink-muted)", fontWeight: 500, textDecoration: "none" }}
        >
          Login
        </Link>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 24px 60px",
        minHeight: "100vh",
      }}>
        {!trackingId ? (
          <div style={{ width: "100%", maxWidth: "600px", textAlign: "center" }}>
            <p style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em",
              color: "var(--color-accent)", textTransform: "uppercase", marginBottom: "20px",
            }}>
              Real-time shipment tracking
            </p>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: "var(--color-ink)",
              marginBottom: "16px",
            }}>
              Where is your<br />
              <span style={{ color: "var(--color-accent)" }}>package?</span>
            </h1>

            <p style={{
              fontSize: "16px", color: "var(--color-ink-muted)",
              fontWeight: 300, marginBottom: "40px", lineHeight: 1.6,
            }}>
              Enter your tracking number below to get live updates.
            </p>

            <TrackingSearchForm />

            <p style={{ fontSize: "12px", color: "#c8c8c0", marginTop: "18px" }}>
              Your tracking number was included in your shipping confirmation email
            </p>
          </div>
        ) : (
          <div style={{ width: "100%", maxWidth: "680px" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontSize: "13px", color: "var(--color-ink-muted)",
                marginBottom: "28px", fontWeight: 500, textDecoration: "none",
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Track another shipment
            </Link>

            {shipment ? (
              <PublicTrackingResult shipment={shipment} />
            ) : (
              <div style={{
                background: "white",
                border: "1px solid var(--color-border)",
                borderRadius: "20px",
                padding: "56px 40px",
                textAlign: "center",
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  background: "var(--color-surface)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#d0d0c8" strokeWidth="1.5"/>
                    <path d="M15 9l-6 6M9 9l6 6" stroke="#d0d0c8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--color-ink)", marginBottom: "8px" }}>
                  Shipment not found
                </p>
                <p style={{ fontSize: "14px", color: "var(--color-ink-muted)", marginBottom: "6px", fontWeight: 300 }}>
                  No shipment found for tracking number
                </p>
                <p style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--color-accent)", fontWeight: 700, letterSpacing: "0.04em" }}>
                  {trackingId}
                </p>
                <p style={{ fontSize: "12px", color: "#b8b8b2", marginTop: "16px" }}>
                  Double-check the number or contact the sender for assistance.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--color-border)",
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "12px", color: "#c8c8c0" }}>© 2025 SwiftTrack</span>
        <span style={{ fontSize: "12px", color: "#c8c8c0" }}>Courier & Logistics</span>
      </footer>
    </div>
  );
}
