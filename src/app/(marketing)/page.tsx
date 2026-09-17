import Link from "next/link";
import {
  ArrowRight, Check, MapPin, BellRing, Camera, BarChart2, ShieldCheck, Lock,
} from "lucide-react";
import { getShipmentByTrackingId } from "@/lib/actions/shipments";
import { PublicTrackingResult } from "@/components/tracking/public-tracking-result";
import { TrackingSearchForm } from "@/components/tracking/tracking-search-form";

interface PageProps {
  searchParams: Promise<{ track?: string }>;
}

const steps = [
  {
    n: "01",
    title: "We register your shipment",
    body: "The moment a package is picked up, it's logged with a unique tracking ID and an initial status.",
    icon: MapPin,
  },
  {
    n: "02",
    title: "Status updates as it moves",
    body: "Picked up, in transit, out for delivery, delivered — every change is timestamped with a location and note.",
    icon: BellRing,
  },
  {
    n: "03",
    title: "Anyone can track it, no login",
    body: "The tracking ID from the shipping confirmation is all that's needed to see the full delivery timeline.",
    icon: Check,
  },
];

const bentoFeatures = [
  {
    icon: MapPin,
    title: "Full tracking timeline",
    body: "Every shipment carries a running history — pending through delivered — with location and notes at each step.",
    size: "wide",
  },
  {
    icon: BellRing,
    title: "Instant email alerts",
    body: "The moment a status changes, an email goes out automatically. No manual phone calls to make.",
    size: "tall",
  },
  {
    icon: Camera,
    title: "Delivery proof on file",
    body: "Attach photos and documents to any shipment, so proof of delivery is always there when it's needed.",
    size: "tall",
  },
  {
    icon: BarChart2,
    title: "Built for ops teams",
    body: "Search, filter by status, and export the full shipment list to CSV for reporting in one click.",
    size: "wide",
  },
  {
    icon: ShieldCheck,
    title: "No login for customers",
    body: "Anyone with a tracking ID can check status. No account, no app download, no password to lose.",
    size: "normal",
  },
  {
    icon: Lock,
    title: "Access-controlled dashboard",
    body: "The operations dashboard is gated behind admin authentication, separate from public tracking.",
    size: "normal",
  },
];

const comparisonRows = [
  ["Customers see live status", "Rarely", "Depends on the app", "Always, no login"],
  ["Automatic email on status change", "No", "Not usually", "Yes, every update"],
  ["Full timeline with locations", "No", "Limited", "Yes"],
  ["No account needed to track", "n/a", "Varies", "Yes"],
  ["Ops dashboard with CSV export", "No", "No", "Yes"],
];

const faqs = [
  [
    "Do I need an account to track my package?",
    "No. Enter the tracking ID from your shipping confirmation email on the search box above — that's it.",
  ],
  [
    "Where do I find my tracking ID?",
    "It's included in the shipping confirmation email sent when your shipment was created.",
  ],
  [
    "Will I be notified when the status changes?",
    "If the sender has notifications enabled, you'll get an email at every status update — no need to keep refreshing the page.",
  ],
  [
    "Can I see exactly where my package is?",
    "You'll see the last location and status logged by the operations team at each step of the delivery.",
  ],
  [
    "Is shipment data secure?",
    "The admin dashboard is access-controlled. The public tracking page only ever shows information tied to the tracking ID entered.",
  ],
  [
    "I manage my own courier operation — can I use this?",
    "SwiftTrack's dashboard is built for teams managing their own shipments. Reach out via the support link below to get set up.",
  ],
];

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const trackingId = params.track?.trim().toUpperCase() ?? "";
  const shipment = trackingId ? await getShipmentByTrackingId(trackingId) : null;

  return (
    <>
      {/* Hero */}
      <section
        className={`flex flex-col items-center justify-center px-6 pb-16 ${trackingId ? "pt-14" : "pt-[5.5rem]"}`}
      >
        {!trackingId ? (
          <div className="w-full max-w-[600px] text-center">
            <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--color-accent)] uppercase mb-5">
              Real-time shipment tracking
            </p>

            <h1 className="font-extrabold leading-[1.05] tracking-[-0.04em] text-[var(--color-ink)] mb-4 text-[clamp(2.4rem,6vw,4rem)]">
              Where is your<br />
              <span className="text-[var(--color-accent)]">package?</span>
            </h1>

            <p className="text-base text-[var(--color-ink-muted)] font-light mb-10 leading-relaxed">
              Enter your tracking number below to get live updates.
            </p>

            <TrackingSearchForm />

            <p className="text-xs text-[#c8c8c0] mt-[18px]">
              Your tracking number was included in your shipping confirmation email
            </p>
          </div>
        ) : (
          <div className="w-full max-w-[680px]">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-ink-muted)] mb-6 font-medium no-underline"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Track another shipment
            </Link>

            {shipment ? (
              <PublicTrackingResult shipment={shipment} />
            ) : (
              <div className="bg-white border border-[var(--color-border)] rounded-[20px] py-16 px-6 text-center">
                <div className="w-[52px] h-[52px] rounded-full bg-[var(--color-surface)] flex items-center justify-center mx-auto mb-5">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#d0d0c8" strokeWidth="1.5" />
                    <path d="M15 9l-6 6M9 9l6 6" stroke="#d0d0c8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-[var(--color-ink)] mb-2">
                  Shipment not found
                </p>
                <p className="text-sm text-[var(--color-ink-muted)] mb-1.5 font-light">
                  No shipment found for tracking number
                </p>
                <p className="font-mono text-[13px] text-[var(--color-accent)] font-bold tracking-[0.04em]">
                  {trackingId}
                </p>
                <p className="text-xs text-[#b8b8b2] mt-4">
                  Double-check the number or contact the sender for assistance.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {!trackingId && (
        <>
          {/* Stats strip */}
          <div className="st-stats-strip">
            {[
              ["8", "status stages tracked"],
              ["24/7", "live status updates"],
              ["Email", "sent on every change"],
              ["CSV", "export for reporting"],
            ].map(([val, label]) => (
              <div key={label} className="st-stat">
                <strong>{val}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* How it works */}
          <section className="st-section" id="how">
            <div className="st-section-head">
              <h2>From pickup to your doorstep, three steps.</h2>
              <p>No app to install, no account to create — just a tracking ID and a status page that stays current.</p>
            </div>
            <div className="st-steps">
              {steps.map(({ n, title, body, icon: Icon }, i) => (
                <div key={n} className="st-step-group">
                  <div className="st-step-card">
                    <div className="st-step-icon-wrap">
                      <Icon size={20} />
                    </div>
                    <div className="st-step-num">{n}</div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="st-step-connector" aria-hidden>
                      <div className="st-step-line" />
                      <ArrowRight size={13} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Bento features */}
          <section className="st-section st-alt" id="features">
            <div className="st-section-head">
              <h2>Everything a shipment needs, in one place.</h2>
              <p>From the moment it's created to the moment it's marked delivered.</p>
            </div>
            <div className="st-bento">
              {bentoFeatures.map(({ icon: Icon, title, body, size }) => (
                <article key={title} className={`st-bento-card st-bento-${size}`}>
                  <div className="st-bento-icon">
                    <Icon size={18} />
                  </div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Comparison */}
          <section className="st-section" id="compare">
            <div className="st-section-head">
              <h2>Better than a phone call or a spreadsheet.</h2>
              <p>The old ways of tracking a shipment don't scale past a handful of packages.</p>
            </div>
            <div className="st-compare-wrap">
              <div className="st-compare-table" role="table" aria-label="SwiftTrack vs alternatives">
                <div className="st-compare-row st-compare-head" role="row">
                  {["Feature", "Phone calls", "Generic apps", "SwiftTrack"].map((h) => (
                    <div role="columnheader" key={h}>{h}</div>
                  ))}
                </div>
                {comparisonRows.map(([feature, ...rest]) => (
                  <div className="st-compare-row" role="row" key={feature}>
                    <div className="st-compare-feature" role="cell" data-label="Feature">{feature}</div>
                    {rest.slice(0, 2).map((cell, i) => (
                      <div role="cell" key={i} data-label={["Phone calls", "Generic apps"][i]}>{cell}</div>
                    ))}
                    <div className="st-compare-win" role="cell" data-label="SwiftTrack">
                      <Check size={12} /> {rest[2]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="st-section st-alt" id="faq">
            <div className="st-section-head">
              <h2>Simple answers before you search.</h2>
            </div>
            <div className="st-faq-grid">
              {faqs.map(([q, a]) => (
                <details key={q} className="st-faq">
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="st-cta-section">
            <h2>Got a tracking number?<br />Find out exactly where it is.</h2>
            <p>No account, no app — just the tracking ID from your shipping confirmation.</p>
            <a href="#top" className="st-cta-btn">
              Track your package <ArrowRight size={16} />
            </a>
          </section>
        </>
      )}

      <style>{`
        .st-stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .st-stat { padding: 26px 20px; text-align: center; border-right: 1px solid var(--color-border); }
        .st-stat:last-child { border-right: none; }
        .st-stat strong {
          display: block; font-family: var(--font-display);
          font-size: 22px; font-weight: 800; color: var(--color-ink); margin-bottom: 4px;
        }
        .st-stat span {
          font-size: 11.5px; color: var(--color-ink-muted); font-weight: 600;
          text-transform: uppercase; letter-spacing: .09em;
        }

        .st-section { padding: 80px 32px; border-bottom: 1px solid var(--color-border); }
        .st-alt { background: var(--color-surface); }
        .st-section-head { max-width: 660px; margin: 0 auto 52px; text-align: center; }
        .st-section h2 {
          font-family: var(--font-display);
          font-size: clamp(26px, 3.4vw, 42px); font-weight: 800; line-height: 1.1;
          letter-spacing: -.025em; margin: 0 0 14px; color: var(--color-ink);
        }
        .st-section-head p { color: var(--color-ink-muted); font-size: 16px; line-height: 1.7; margin: 0; }

        .st-steps { max-width: 1000px; margin: 0 auto; display: flex; align-items: stretch; }
        .st-step-group { display: flex; align-items: center; flex: 1; min-width: 0; }
        .st-step-card {
          flex: 1; min-width: 0; background: white; border: 1px solid var(--color-border);
          border-radius: 14px; padding: 26px 22px; position: relative;
        }
        .st-step-icon-wrap {
          width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--color-border);
          color: var(--color-accent); display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
        }
        .st-step-num { position: absolute; top: 16px; right: 18px; font-size: 11px; font-weight: 800; color: #c0c0b8; }
        .st-step-card h3 { margin: 0 0 8px; font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--color-ink); }
        .st-step-card p { margin: 0; font-size: 14px; color: var(--color-ink-muted); line-height: 1.65; font-weight: 300; }
        .st-step-connector { display: flex; align-items: center; padding: 0 6px; color: #c0c0b8; flex-shrink: 0; }
        .st-step-line {
          width: 20px; height: 1px;
          background: repeating-linear-gradient(90deg, var(--color-border) 0, var(--color-border) 3px, transparent 3px, transparent 8px);
        }

        .st-bento { max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
        .st-bento-card {
          background: white; border: 1px solid var(--color-border); border-radius: 14px; padding: 22px;
          display: flex; flex-direction: column; gap: 9px;
        }
        .st-bento-wide { grid-column: span 4; }
        .st-bento-tall { grid-column: span 2; }
        .st-bento-normal { grid-column: span 3; }
        .st-bento-icon {
          width: 38px; height: 38px; border-radius: 9px; border: 1px solid var(--color-border);
          color: var(--color-accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .st-bento-card h3 { margin: 0; font-family: var(--font-display); font-size: 15.5px; font-weight: 700; color: var(--color-ink); }
        .st-bento-card p { margin: 0; font-size: 13.5px; color: var(--color-ink-muted); line-height: 1.6; font-weight: 300; }

        .st-compare-wrap { max-width: 1160px; margin: 0 auto; }
        .st-compare-table { border: 1px solid var(--color-border); border-radius: 14px; overflow: hidden; background: white; }
        .st-compare-row { display: grid; grid-template-columns: 1.4fr repeat(3, minmax(0,1fr)); min-height: 56px; border-bottom: 1px solid var(--color-border); }
        .st-compare-row:last-child { border-bottom: 0; }
        .st-compare-row > div {
          padding: 13px 16px; display: flex; align-items: center; border-right: 1px solid var(--color-border);
          color: var(--color-ink-muted); font-size: 13px; line-height: 1.45;
        }
        .st-compare-row > div:last-child { border-right: 0; }
        .st-compare-head { background: var(--color-surface); min-height: 44px; }
        .st-compare-head > div { color: var(--color-ink); font-weight: 700; font-size: 11.5px; text-transform: uppercase; letter-spacing: .07em; }
        .st-compare-feature { color: var(--color-ink) !important; font-weight: 700; }
        .st-compare-win { color: var(--color-accent) !important; font-weight: 700; gap: 8px; }
        .st-compare-win svg { flex-shrink: 0; }

        .st-faq-grid { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .st-faq { background: white; border: 1px solid var(--color-border); border-radius: 12px; overflow: hidden; }
        .st-faq summary {
          cursor: pointer; padding: 18px 20px; color: var(--color-ink); font-weight: 700; font-size: 14px;
          line-height: 1.4; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 12px;
        }
        .st-faq summary::-webkit-details-marker { display: none; }
        .st-faq summary::after { content: '+'; font-size: 20px; font-weight: 300; color: #b0b0a8; flex-shrink: 0; transition: transform .2s; }
        .st-faq[open] summary::after { transform: rotate(45deg); }
        .st-faq p { color: var(--color-ink-muted); padding: 14px 20px 20px; margin: 0; font-size: 13.5px; line-height: 1.7; border-top: 1px solid var(--color-border); font-weight: 300; }

        .st-cta-section { padding: 96px 32px; text-align: center; background: var(--color-ink); }
        .st-cta-section h2 { font-family: var(--font-display); font-size: clamp(26px, 3.4vw, 46px); font-weight: 800; line-height: 1.15; letter-spacing: -.025em; margin: 0 0 16px; color: white; }
        .st-cta-section p { color: rgba(255,255,255,.6); font-size: 16px; line-height: 1.7; margin: 0 0 36px; font-weight: 300; }
        .st-cta-btn {
          display: inline-flex; align-items: center; gap: 9px; color: var(--color-ink); background: white;
          border-radius: 10px; padding: 15px 32px; text-decoration: none; font-family: var(--font-display); font-weight: 700; font-size: 15px;
          transition: opacity .12s;
        }
        .st-cta-btn:hover { opacity: .85; }

        @media (max-width: 1100px) {
          .st-bento-wide { grid-column: span 6; }
          .st-bento-tall { grid-column: span 3; }
          .st-bento-normal { grid-column: span 3; }
        }
        @media (max-width: 900px) {
          .st-steps { flex-direction: column; }
          .st-step-connector { display: none; }
          .st-step-group, .st-step-card { width: 100%; }
          .st-bento { grid-template-columns: 1fr; }
          .st-bento-wide, .st-bento-tall, .st-bento-normal { grid-column: span 1; }
          .st-faq-grid { grid-template-columns: 1fr; }
          .st-compare-row { grid-template-columns: 1fr; }
          .st-compare-head { display: none; }
          .st-compare-row > div { border-right: 0; border-bottom: 1px solid var(--color-border); justify-content: space-between; }
          .st-compare-row > div:last-child { border-bottom: 0; }
          .st-compare-row > div::before {
            content: attr(data-label); color: #b0b0a8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em;
          }
          .st-compare-feature::before { display: none; }
          .st-compare-feature { background: var(--color-surface); }
          .st-stats-strip { grid-template-columns: repeat(2, 1fr); }
          .st-stat:nth-child(2n) { border-right: none; }
          .st-stat:nth-child(n+3) { border-top: 1px solid var(--color-border); }
        }
        @media (max-width: 640px) {
          .st-section { padding: 56px 20px; }
          .st-section-head { margin-bottom: 36px; }
          .st-cta-section { padding: 72px 20px; }
        }
      `}</style>
    </>
  );
}
