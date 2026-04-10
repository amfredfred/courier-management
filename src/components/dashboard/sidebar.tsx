"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, BarChart3, LogOut, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const nav = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/shipments", icon: Package,          label: "Shipments" },
  { href: "/dashboard/analytics", icon: BarChart3,        label: "Analytics" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside style={{
      width: "220px",
      flexShrink: 0,
      background: "white",
      borderRight: "1px solid var(--color-border)",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "30px", height: "30px", background: "var(--color-accent)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="21" r="1" fill="white" stroke="white"/>
              <circle cx="20" cy="21" r="1" fill="white" stroke="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--color-ink)", letterSpacing: "-0.02em" }}>
            SwiftTrack
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {nav.map((item) => {
          const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "9px",
              marginBottom: "2px",
              fontSize: "13px",
              fontWeight: active ? 600 : 400,
              color: active ? "var(--color-ink)" : "var(--color-ink-muted)",
              background: active ? "var(--color-surface)" : "transparent",
              textDecoration: "none",
              transition: "all 0.15s",
              fontFamily: "var(--font-body)",
            }}>
              <item.icon size={15} strokeWidth={active ? 2.5 : 1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "10px", borderTop: "1px solid var(--color-border)" }}>
        <Link href="/" target="_blank" style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "9px 12px", borderRadius: "9px",
          fontSize: "13px", color: "var(--color-ink-muted)",
          textDecoration: "none",
          transition: "all 0.15s",
          marginBottom: "2px",
        }}>
          <ExternalLink size={14} strokeWidth={1.75} />
          Public Tracker
        </Link>
        <button onClick={handleLogout} style={{
          width: "100%",
          display: "flex", alignItems: "center", gap: "10px",
          padding: "9px 12px", borderRadius: "9px",
          fontSize: "13px", color: "var(--color-ink-muted)",
          background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
          fontFamily: "var(--font-body)",
          transition: "all 0.15s",
        }}>
          <LogOut size={14} strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
