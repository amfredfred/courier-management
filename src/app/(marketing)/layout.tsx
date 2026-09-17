import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="st-shell">
      <header className="st-nav">
        <Link href="/" className="st-brand" aria-label="SwiftTrack home">
          <BrandLogo size={30} />
          <span>SwiftTrack</span>
        </Link>
        <nav className="st-links" aria-label="Main navigation">
          <Link href="/#how">How it works</Link>
          <Link href="/#features">Features</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <div className="st-actions">
          <Link href="/" className="st-nav-primary">
            Track a package
          </Link>
        </div>
      </header>

      {children}

      <footer className="st-footer">
        <div className="st-footer-brand-col">
          <Link href="/" className="st-footer-brand">
            <BrandLogo size={26} />
            <strong>SwiftTrack</strong>
          </Link>
          <p>
            Real-time courier and shipment tracking. Every status change, timestamped and visible
            to the people waiting on a delivery.
          </p>
        </div>
        <nav className="st-footer-col">
          <strong>Product</strong>
          <Link href="/#how">How it works</Link>
          <Link href="/#features">Features</Link>
          <Link href="/#compare">Compare</Link>
        </nav>
        <nav className="st-footer-col">
          <strong>Track</strong>
          <Link href="/">Track a package</Link>
        </nav>
        <nav className="st-footer-col">
          <strong>Company</strong>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:support@swifttrack.app">Support</a>
        </nav>
      </footer>

      <style>{`
        .st-shell {
          font-family: var(--font-body);
          background: #fafaf8;
        }

        /* ── Nav ── */
        .st-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 20px;
          height: 68px;
          padding: 0 32px;
          background: color-mix(in srgb, #fafaf8 88%, transparent);
          border-bottom: 1px solid var(--color-border);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .st-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--color-ink);
          text-decoration: none;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.02em;
        }
        .st-links { display: flex; justify-content: center; gap: 2px; }
        .st-links a {
          color: var(--color-ink-muted);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          padding: 7px 13px;
          border-radius: 7px;
          transition: color .12s, background .12s;
        }
        .st-links a:hover { color: var(--color-ink); background: var(--color-surface); }
        .st-actions { display: flex; align-items: center; gap: 10px; }
        .st-nav-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: white;
          background: var(--color-ink);
          border-radius: 8px;
          padding: 9px 18px;
          text-decoration: none;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 13.5px;
          transition: opacity .12s;
        }
        .st-nav-primary:hover { opacity: .82; }

        /* ── Footer ── */
        .st-footer {
          display: grid;
          grid-template-columns: minmax(260px, 1.7fr) repeat(3, minmax(110px, 1fr));
          gap: 32px;
          padding: 52px 32px;
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
        }
        .st-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--color-ink);
          text-decoration: none;
          font-family: var(--font-display);
          font-weight: 700;
          margin-bottom: 12px;
        }
        .st-footer-brand-col p {
          max-width: 360px;
          font-size: 13.5px;
          line-height: 1.75;
          margin: 0;
          color: var(--color-ink-muted);
        }
        .st-footer-col { display: grid; align-content: start; gap: 10px; }
        .st-footer-col strong {
          font-family: var(--font-display);
          font-size: 12.5px;
          font-weight: 700;
          color: var(--color-ink);
          margin-bottom: 3px;
        }
        .st-footer a {
          color: var(--color-ink-muted);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
        }
        .st-footer a:hover { color: var(--color-ink); }

        @media (max-width: 900px) {
          .st-links { display: none; }
          .st-footer { grid-template-columns: 1fr 1fr 1fr; }
          .st-footer-brand-col { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .st-nav { padding: 0 20px; }
          .st-footer { grid-template-columns: 1fr; padding: 36px 20px; }
        }

        /* ── Legal pages ── */
        .st-legal { max-width: 720px; margin: 0 auto; padding: 72px 24px 96px; }
        .st-legal-eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
          color: var(--color-accent); margin: 0 0 14px;
        }
        .st-legal h1 {
          font-family: var(--font-display); font-size: clamp(28px, 4vw, 40px); font-weight: 800;
          letter-spacing: -.03em; color: var(--color-ink); margin: 0 0 10px;
        }
        .st-legal-updated { font-size: 13px; color: #b0b0a8; margin: 0 0 48px; }
        .st-legal h2 {
          font-family: var(--font-display); font-size: 19px; font-weight: 700; color: var(--color-ink);
          margin: 40px 0 12px;
        }
        .st-legal h2:first-of-type { margin-top: 0; }
        .st-legal p, .st-legal li {
          font-size: 14.5px; line-height: 1.75; color: var(--color-ink-muted); font-weight: 300; margin: 0 0 14px;
        }
        .st-legal ul { padding-left: 20px; margin: 0 0 14px; }
        .st-legal a { color: var(--color-accent); font-weight: 500; }
      `}</style>
    </div>
  );
}
