"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("Invalid credentials.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "var(--font-body)" }}>
      {/* Left — brand panel */}
      <div style={{
        width: "420px",
        flexShrink: 0,
        background: "var(--color-ink)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px",
      }} className="hidden lg:flex">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "var(--color-accent)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="21" r="1" fill="white" stroke="white"/>
              <circle cx="20" cy="21" r="1" fill="white" stroke="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>SwiftTrack</span>
        </Link>

        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, color: "white", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: "16px" }}>
            Manage every shipment with precision.
          </p>
          <p style={{ fontSize: "14px", color: "#6b6b6b", fontWeight: 300, lineHeight: 1.6 }}>
            The logistics dashboard built for teams who need speed and clarity.
          </p>
        </div>

        <p style={{ fontSize: "12px", color: "#3a3a3a" }}>© 2025 SwiftTrack</p>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", background: "#fafaf8" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-10" style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--color-ink)" }}>
            <div style={{ width: "28px", height: "28px", background: "var(--color-accent)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            SwiftTrack
          </Link>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-ink-muted)", marginBottom: "36px", fontWeight: 300 }}>
            Sign in to your account to continue.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-ink)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontFamily: "var(--font-body)",
                  color: "var(--color-ink)",
                  background: "white",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-ink)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-ink)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 14px",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontFamily: "var(--font-body)",
                    color: "var(--color-ink)",
                    background: "white",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-ink)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#b0b0a8", padding: 0 }}
                >
                  {showPass ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "13px",
                background: isPending ? "#6b6b6b" : "var(--color-ink)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                cursor: isPending ? "not-allowed" : "pointer",
                letterSpacing: "-0.01em",
                transition: "opacity 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isPending && (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </svg>
              )}
              {isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p style={{ marginTop: "28px", fontSize: "12px", color: "#c0c0b8", textAlign: "center" }}>
            Track a package?{" "}
            <Link href="/" style={{ color: "var(--color-accent)", fontWeight: 600, textDecoration: "none" }}>
              Go to tracking →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
