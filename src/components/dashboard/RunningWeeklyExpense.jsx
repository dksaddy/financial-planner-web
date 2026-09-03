"use client";

import { useState } from "react";
import { FiActivity, FiPlus } from "react-icons/fi";

import Section from "./Section";
import AddExpenseModal from "./AddExpenseModal";

export default function RunningWeeklyExpense({
  currentWeek,
  onExpenseAdded,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const records = currentWeek?.records || [];

  const maxTotal = records.reduce(
    (max, record) => Math.max(max, Number(record.total) || 0),
    0
  );

  return (
    <Section
      title="Running Weekly Expense"
      icon={FiActivity}
      accent="cyan"
      actions={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group/btn flex items-center gap-1.5 rounded-xl border border-cyan-line bg-cyan-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-fg transition hover:border-cyan-dot hover:bg-cyan-soft active:scale-95"
        >
          <FiPlus
            size={13}
            strokeWidth={2.6}
            className="transition-transform group-hover/btn:rotate-90"
          />
          Add
        </button>
      }
    >
      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onExpenseAdded}
      />

      {records.length === 0 ? (
        <div className="flex min-h-[96px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-inset">
          <p className="text-sm text-ink-muted">
            No expenses recorded this week.
          </p>

          <p className="text-xs text-ink-faint">
            Add one to start tracking.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {/* Records list — 60% */}
          <div className="space-y-2 lg:w-3/5">
            {records.map((record) => (
              // Narrow screens stack the row into two lines (date + name,
              // then the figures) — the fixed-width date/badge/total columns
              // otherwise leave no room for the expense name.
              <div
                key={record.id}
                className="flex flex-col gap-1.5 rounded-xl border border-line-soft bg-inset px-3.5 py-2.5 text-sm transition hover:border-cyan-line hover:bg-cyan-soft sm:flex-row sm:items-center sm:gap-3"
              >
                <div className="flex min-w-0 items-center justify-between gap-2.5 sm:flex-1">
                  <span className="shrink-0 text-xs font-medium text-ink-faint sm:w-24">
                    {formatDate(record.date)}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-right font-medium text-ink sm:text-left">
                    {record.expense_type_name}
                  </span>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <span className="text-xs sm:w-24 sm:text-right">
                    {record.extraSave === null ? (
                      <span className="text-ink-faint">—</span>
                    ) : (
                      <span className="num rounded-full bg-emerald-soft px-2 py-0.5 font-medium text-emerald-fg ring-1 ring-inset ring-emerald-line">
                        +{Number(record.extraSave).toFixed(2)}
                      </span>
                    )}
                  </span>

                  <span className="num shrink-0 text-right font-bold text-ink sm:w-20">
                    {Number(record.total).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bar chart — 40% */}
          <div
            className="flex flex-col rounded-xl border border-line-soft bg-inset p-3 sm:p-4 lg:w-2/5"
            style={{
              backgroundImage:
                "linear-gradient(var(--line-soft) 1px, transparent 1px), linear-gradient(90deg, var(--line-soft) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          >
            <div className="relative flex h-28 items-end justify-between gap-1.5 sm:h-36 sm:gap-3">
              {records.map((record) => {
                const total = Number(record.total) || 0;
                const percent =
                  maxTotal > 0 ? Math.max((total / maxTotal) * 100, 3) : 0;

                return (
                  <div
                    key={record.id}
                    title={`${formatDate(record.date)} — ${total.toFixed(2)}`}
                    className="relative z-[1] flex h-full flex-1 flex-col items-center justify-end gap-1"
                  >
                    <span className="num text-[8px] font-bold text-ink-faint sm:text-[9px]">
                      {total.toFixed(0)}
                    </span>

                    <div
                      className="bar-grow w-full max-w-[16px] rounded-t-md bg-gradient-to-t from-cyan-500 to-sky-400 shadow-[0_0_10px_-2px_var(--cyan-dot)] sm:max-w-[22px]"
                      style={{ height: `${percent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-2 flex justify-between gap-1.5 border-t border-line-soft pt-2 sm:gap-3">
              {records.map((record) => (
                <span
                  key={record.id}
                  className="flex-1 text-center text-[8px] font-medium uppercase text-ink-faint sm:text-[9px]"
                >
                  {formatDate(record.date).slice(0, 3)}
                </span>
              ))}
            </div>

            <div className="mt-3 flex flex-1 items-center justify-center">
              <span className="text-center text-base font-bold uppercase tracking-[0.14em] text-ink">
                Daily total
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3">
        <span className="num rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted ring-1 ring-inset ring-line">
          {currentWeek.totalRecords} records
        </span>

        <span className="num rounded-full bg-cyan-soft px-2.5 py-1 text-[11px] font-medium text-cyan-fg ring-1 ring-inset ring-cyan-line">
          total {Number(currentWeek.totalExpense).toFixed(2)}
        </span>

        <span className="num rounded-full bg-emerald-soft px-2.5 py-1 text-[11px] font-medium text-emerald-fg ring-1 ring-inset ring-emerald-line">
          saved {Number(currentWeek.totalExtraSave).toFixed(2)}
        </span>
      </div>
    </Section>
  );
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  const weekday = parsed.toLocaleDateString("en-GB", {
    weekday: "short",
  });

  const dayMonth = parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  return `${weekday}, ${dayMonth}`;
}
