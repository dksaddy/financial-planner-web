"use client";

import Link from "next/link";
import Image from "next/image";
import { FiHome } from "react-icons/fi";

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
            <Image
              src={user.avatar_url}
              alt={user?.name || "Profile photo"}
              width={48}
              height={48}
              className="relative h-12 w-12 rounded-2xl object-cover shadow-lg shadow-indigo-500/30 ring-1 ring-white/20"
            />
          ) : (
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
              {initial}
            </span>
          )}
        </Link>

        <h1 className="text-[20.9px] font-bold uppercase leading-tight sm:text-[29.64px] tracking-[0.06em] text-ink">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Way back out to the landing page. Icon-only below `sm`, where the
            header already carries the avatar, the title and the toggle. */}
        <Link
          href="/"
          className="group flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-xs font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink sm:px-3.5"
          aria-label="Go to home page"
        >
          <FiHome size={15} strokeWidth={2.2} />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
