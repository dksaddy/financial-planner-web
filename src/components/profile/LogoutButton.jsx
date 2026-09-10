"use client";

import { FiLogOut } from "react-icons/fi";

/**
 * Rendered twice on the profile page and shown once: in the page header from
 * `sm` up, and inside the Photo card's header below it, where the narrow
 * header has no room beside the title and the address.
 *
 * Which one is visible is the caller's business — pass the responsive
 * `className`. Keeping it one component means the two placements cannot
 * drift apart in wording or behaviour.
 */
export default function LogoutButton({
  onLogout,
  loggingOut = false,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loggingOut}
      aria-label="Logout"
      title="Logout"
      className={`group h-8 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-[12.54px] font-bold uppercase tracking-wider text-ink-muted transition hover:border-rose-line hover:bg-rose-soft hover:text-rose-fg disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <FiLogOut
        size={14}
        className="shrink-0 transition-transform group-hover:translate-x-0.5"
      />
      Logout
    </button>
  );
}
