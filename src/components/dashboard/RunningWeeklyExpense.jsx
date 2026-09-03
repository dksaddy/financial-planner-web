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
        <div className="space-y-2">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-inset px-3.5 py-2.5 text-sm transition hover:border-cyan-line hover:bg-cyan-soft"
            >
              <span className="w-24 shrink-0 text-xs font-medium text-ink-faint">
                {formatDate(record.date)}
              </span>

              <span className="flex-1 truncate font-medium text-ink">
                {record.expense_type_name}
              </span>

              <span className="w-24 shrink-0 text-right text-xs">
                {record.extraSave === null ? (
                  <span className="text-ink-faint">—</span>
                ) : (
                  <span className="num rounded-full bg-emerald-soft px-2 py-0.5 font-medium text-emerald-fg ring-1 ring-inset ring-emerald-line">
                    +{Number(record.extraSave).toFixed(2)}
                  </span>
                )}
              </span>

              <span className="num w-20 shrink-0 text-right font-bold text-ink">
                {Number(record.total).toFixed(2)}
              </span>
            </div>
          ))}
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
