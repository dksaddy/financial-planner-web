"use client";

// Horizontally scrollable row of month filter pills (plus an "All" tab).
// Scrolls instead of wrapping so it stays a single tidy row even with
// many months, and the scrollbar itself is hidden for a cleaner look.
export default function MonthTabs({ months, active, onChange }) {
  if (!months || months.length <= 1) return null;

  return (
    <div
      className="mb-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1
      [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {months.map((month) => {
        const isActive = month.key === active;

        return (
          <button
            key={month.key}
            type="button"
            onClick={() => onChange(month.key)}
            aria-pressed={isActive}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold
            uppercase tracking-wider transition active:scale-95 ${
              isActive
                ? "bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-lg shadow-indigo-500/30"
                : "border border-line bg-surface text-ink-muted hover:border-line-strong hover:bg-surface-hover hover:text-ink"
            }`}
          >
            {month.label}
          </button>
        );
      })}
    </div>
  );
}