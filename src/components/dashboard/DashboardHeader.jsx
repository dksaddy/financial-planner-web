"use client";

import { FiLogOut } from "react-icons/fi";

import ThemeToggle from "@/components/common/ThemeToggle";

export default function DashboardHeader({ user, onLogout }) {
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        {/* Monogram badge */}
        <div className="relative">
          <span
            aria-hidden
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-60 blur-md"
          />

          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
            {initial}
          </span>
        </div>

        <div>
          <h1 className="text-[26px] font-bold uppercase leading-tight tracking-[0.06em] text-ink">
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

        <button
          onClick={onLogout}
          className="group flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-rose-line hover:bg-rose-soft hover:text-rose-fg"
        >
          <FiLogOut
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
          Logout
        </button>
      </div>
    </header>
  );
}
