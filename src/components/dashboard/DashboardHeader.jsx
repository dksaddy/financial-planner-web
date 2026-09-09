"use client";

import Link from "next/link";

import ThemeToggle from "@/components/common/ThemeToggle";

// Logging out lives on the profile page — the avatar badge here is the way
// there.
export default function DashboardHeader({ user }) {
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        {/* Avatar (or monogram) badge — doubles as the way into the profile */}
        <Link
          href="/dashboard/profile"
          className="group relative shrink-0"
          aria-label="Open profile"
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-60 blur-md transition group-hover:opacity-90"
          />

          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user?.name || "Profile photo"}
              className="relative h-12 w-12 rounded-2xl object-cover shadow-lg shadow-indigo-500/30 ring-1 ring-white/20"
            />
          ) : (
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
              {initial}
            </span>
          )}
        </Link>

        <div>
          <h1 className="text-[31.2px] font-bold uppercase leading-tight tracking-[0.06em] text-ink">
            Dashboard
          </h1>

          {user?.name && (
            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-dot" />
              Welcome back,
              <span className="font-bold text-ink">{user.name}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
