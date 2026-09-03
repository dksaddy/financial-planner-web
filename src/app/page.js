import Link from "next/link";

import ThemeToggle from "@/components/common/ThemeToggle";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-5">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <div className="reveal w-full max-w-lg text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-dot" />
          Personal finance, in one view
        </span>

        <h1 className="mb-3 text-5xl font-bold uppercase tracking-[0.04em] text-ink">
          Financial Planner
        </h1>

        <p className="mb-9 text-base text-ink-muted">
          Track your expenses, savings, and targets in one place.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 hover:shadow-indigo-500/50 active:scale-[0.98]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-line bg-surface px-7 py-3 text-sm font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
