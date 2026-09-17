"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, BarChart3, LogOut, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/brand-logo";

const nav = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/shipments", icon: Package,          label: "Shipments" },
  { href: "/dashboard/analytics", icon: BarChart3,        label: "Analytics" },
];

interface Props {
  userEmail?: string | null;
}

export function Sidebar({ userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initial = userEmail?.trim()?.[0]?.toUpperCase() ?? "A";

  return (
    <aside className="w-56 shrink-0 h-full bg-white border-r border-[var(--color-border)] flex flex-col">
      {/* Logo */}
      <div className="py-5 px-[18px] border-b border-[var(--color-border)] shrink-0">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={30} />
          <span className="font-bold text-sm text-[var(--color-ink)] tracking-[-0.02em]">
            SwiftTrack
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-[18px] px-3">
        <p className="text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#c0c0b8] px-2.5 mb-2.5">
          Menu
        </p>
        {nav.map((item) => {
          const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2.5 py-[9px] pr-3 pl-3.5 rounded-[9px] mb-0.5 text-[13px] no-underline transition-[background,color] duration-150 ${
                active ? "font-semibold text-[var(--color-ink)] bg-[var(--color-surface)]" : "font-normal text-[var(--color-ink-muted)] bg-transparent"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-[0_3px_3px_0] bg-[var(--color-accent)]" />
              )}
              <item.icon size={16} strokeWidth={active ? 2.25 : 1.75} color={active ? "var(--color-accent)" : undefined} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--color-border)] shrink-0">
        {userEmail && (
          <div className="flex items-center gap-2.5 pt-3.5 px-4 pb-2.5">
            <div className="w-7 h-7 rounded-full shrink-0 bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center font-bold text-xs">
              {initial}
            </div>
            <span className="text-[12.5px] font-medium text-[var(--color-ink)] overflow-hidden text-ellipsis whitespace-nowrap">
              {userEmail}
            </span>
          </div>
        )}
        <div className="pt-1.5 px-2.5 pb-2.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 py-[9px] px-3 rounded-[9px] text-[13px] text-[var(--color-ink-muted)] no-underline transition-colors duration-150 mb-0.5"
          >
            <ExternalLink size={14} strokeWidth={1.75} />
            Public tracker
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 py-[9px] px-3 rounded-[9px] text-[13px] text-[var(--color-ink-muted)] bg-transparent border-none cursor-pointer text-left transition-[background,color] duration-150"
          >
            <LogOut size={14} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
