import Link from "next/link";
import { FiGrid } from "react-icons/fi";

import ThemeToggle from "@/components/common/ThemeToggle";
import AuthSwitch from "@/components/landing/AuthSwitch";

export default function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-app/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
            FP
          </span>

          {/* The badge carries the identity on a phone, where the wordmark
              plus both buttons would not fit on one row. */}
          <span className="hidden text-sm font-bold uppercase tracking-[0.18em] text-ink sm:inline">
            Financial
            <span className="text-ink-faint"> / </span>
            Planner
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <AuthSwitch
            loggedOut={
              <>
                <Link
                  href="/login"
                  className="hidden h-10 items-center rounded-xl border border-line bg-surface px-4 text-xs font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink sm:flex"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="flex h-10 items-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 hover:shadow-indigo-500/50 active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </>
            }
            loggedIn={
              <Link
                href="/dashboard"
                className="group flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 hover:shadow-indigo-500/50 active:scale-[0.98]"
              >
                <FiGrid size={14} strokeWidth={2.4} />
                Dashboard
              </Link>
            }
          />
        </div>
      </nav>
    </header>
  );
}
