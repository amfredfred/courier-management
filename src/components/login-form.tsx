"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const inputClass = "w-full py-3 px-3.5 border-[1.5px] border-[var(--color-border)] rounded-[10px] text-sm text-[var(--color-ink)] bg-white outline-none transition-colors duration-200 focus:border-[var(--color-ink)]";

export function LoginForm() {
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
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex w-[420px] shrink-0 bg-[var(--color-ink)] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="21" r="1" fill="white" stroke="white"/>
              <circle cx="20" cy="21" r="1" fill="white" stroke="white"/>
            </svg>
          </div>
          <span className="font-bold text-base text-white tracking-[-0.02em]">SwiftTrack</span>
        </Link>

        <div>
          <p className="font-extrabold text-[28px] text-white leading-[1.2] tracking-[-0.03em] mb-4">
            Manage every shipment with precision.
          </p>
          <p className="text-sm text-[#6b6b6b] font-light leading-relaxed">
            The logistics dashboard built for teams who need speed and clarity.
          </p>
        </div>

        <p className="text-xs text-[#3a3a3a]">© 2025 SwiftTrack</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#fafaf8]">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-10 font-bold text-[15px] text-[var(--color-ink)]">
            <div className="w-7 h-7 bg-[var(--color-accent)] rounded-[7px] flex items-center justify-center">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            SwiftTrack
          </Link>

          <h1 className="font-extrabold text-[28px] text-[var(--color-ink)] tracking-[-0.03em] mb-1.5">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--color-ink-muted)] mb-9 font-light">
            Sign in to your account to continue.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] tracking-[0.05em] uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-ink)] tracking-[0.05em] uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-[44px]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#b0b0a8] p-0"
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
              className={`mt-2 w-full py-3.5 text-white border-none rounded-[10px] text-sm font-bold tracking-[-0.01em] transition-opacity duration-200 flex items-center justify-center gap-2 ${
                isPending ? "bg-[#6b6b6b] cursor-not-allowed" : "bg-[var(--color-ink)] cursor-pointer"
              }`}
            >
              {isPending && (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
              {isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-xs text-[#c0c0b8] text-center">
            Track a package?{" "}
            <Link href="/" className="text-[var(--color-accent)] font-semibold no-underline">
              Go to tracking →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
