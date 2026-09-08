"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Page-number strip with first/last always shown and an ellipsis on either
// side of the current page, so the row stays a fixed width however many
// pages there are.
const pageWindow = (page, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push("start-gap");

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  if (end < totalPages - 1) pages.push("end-gap");

  pages.push(totalPages);

  return pages;
};

export default function Pagination({
  page,
  totalPages,
  onChange,
  accent = "indigo",
}) {
  if (totalPages <= 1) return null;

  const activeClasses =
    accent === "amber"
      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
      : "bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-lg shadow-indigo-500/30";

  const idleClasses =
    "border border-line bg-surface text-ink-muted hover:border-line-strong hover:bg-surface-hover hover:text-ink";

  return (
    <nav
      aria-label="Pagination"
      className="mt-5 flex items-center justify-center gap-1.5 border-t border-line-soft pt-4"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface disabled:hover:text-ink-muted ${idleClasses}`}
      >
        <FiChevronLeft size={15} />
      </button>

      {pageWindow(page, totalPages).map((entry) =>
        typeof entry === "number" ? (
          <button
            key={entry}
            type="button"
            onClick={() => onChange(entry)}
            aria-current={entry === page ? "page" : undefined}
            className={`num h-9 min-w-9 shrink-0 rounded-lg px-2.5 text-xs font-bold transition active:scale-95 ${
              entry === page ? activeClasses : idleClasses
            }`}
          >
            {entry}
          </button>
        ) : (
          <span
            key={entry}
            aria-hidden
            className="px-1 text-xs text-ink-faint"
          >
            …
          </span>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface disabled:hover:text-ink-muted ${idleClasses}`}
      >
        <FiChevronRight size={15} />
      </button>
    </nav>
  );
}
