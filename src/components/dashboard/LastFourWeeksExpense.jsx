"use client";

import { useState } from "react";
import { FiCalendar, FiChevronRight } from "react-icons/fi";

import Section from "./Section";
import Modal from "@/components/common/Modal";

const WEEK_LABELS = {
  week1: "1 Week Ago",
  week2: "2 Weeks Ago",
  week3: "3 Weeks Ago",
  week4: "4 Weeks Ago",
};

export default function LastFourWeeksExpense({
  lastFourWeeks = {},
  weeklyBudget = 0,
  dailyBudget = 0,
}) {
  const [activeWeek, setActiveWeek] = useState(null);

  const budget = Number(weeklyBudget || 0);
  const daily = Number(dailyBudget || 0);

  const activeItems = activeWeek
    ? lastFourWeeks[activeWeek] || []
    : [];

  const activeTotal = activeItems.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  // A completed week is measured against the whole weekly budget, not
  // against the days that happen to have an expense record: an unrecorded
  // working day is a day nothing was spent, so its budget was saved.
  // Summing the per-day `extraSave` figures instead would only credit
  // recorded days and report a week under budget as overspent.
  const activeSaved = budget - activeTotal;

  const activeOverBudget = budget > 0 && activeTotal > budget;
  const activeOverPercent = activeOverBudget
    ? ((activeTotal - budget) / budget) * 100
    : 0;

  // Sum of the per-day `extraSave` figures the API stores — real
  // "budget - spent" for each recorded day only, unlike `activeSaved`
  // above which also credits unrecorded days with a full day's budget.
  const activeDailySaved = activeItems.reduce(
    (sum, item) =>
      item.extraSave === null ? sum : sum + Number(item.extraSave),
    0
  );

  const weeks = Object.entries(WEEK_LABELS).map(([weekKey, label]) => {
    const items = lastFourWeeks[weekKey] || [];

    const total = items.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    );

    const saved = budget - total;

    // Sum of the per-day `extraSave` figures the API stores — real
    // "budget - spent" for each recorded day only. Unlike `saved` above,
    // this does not credit unrecorded days with a full day's budget.
    const dailySaved = items.reduce(
      (sum, item) =>
        item.extraSave === null
          ? sum
          : sum + Number(item.extraSave),
      0
    );

    return {
      weekKey,
      label,
      items,
      total,
      saved,
      dailySaved,
    };
  });

  // Display-only: the bar's full width is the weekly budget itself, fixed
  // for every card — not whichever week happens to be busiest. A week
  // under budget fills proportionally in blue; a week over budget caps
  // out the bar and turns it red. Falls back to the busiest week when
  // there's no budget to scale by. Does not affect any figure.
  const scaleMax =
    budget > 0
      ? budget
      : Math.max(...weeks.map((week) => week.total), 0);

  return (
    <Section
      title="Last Four Weekly Expense"
      icon={FiCalendar}
      accent="indigo"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {weeks.map(({ weekKey, label, items, total, saved, dailySaved }) => {
          const overBudget = budget > 0 && total > budget;
          const overPercent = overBudget
            ? ((total - budget) / budget) * 100
            : 0;
          const usedPercent = budget > 0 ? (total / budget) * 100 : 0;

          return (
          <button
            key={weekKey}
            type="button"
            onClick={() => setActiveWeek(weekKey)}
            className="group/week rounded-xl border border-line-soft bg-inset p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-line hover:bg-indigo-soft"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-bold text-ink">
                    {label}
                  </p>

                  {overBudget ? (
                    <span className="num shrink-0 rounded-full bg-rose-soft px-1.5 py-0.5 text-[10px] font-bold text-rose-fg ring-1 ring-inset ring-rose-line">
                      +{overPercent.toFixed(0)}%
                    </span>
                  ) : (
                    budget > 0 && (
                      <span className="num shrink-0 rounded-full bg-indigo-soft px-1.5 py-0.5 text-[10px] font-bold text-indigo-fg ring-1 ring-inset ring-indigo-line">
                        {usedPercent.toFixed(0)}%
                      </span>
                    )
                  )}
                </div>

                <p className="num text-[11px] text-ink-faint">
                  {items.length} records
                </p>
              </div>

              <FiChevronRight
                size={15}
                className="shrink-0 text-ink-faint transition group-hover/week:translate-x-0.5 group-hover/week:text-indigo-fg"
              />
            </div>

            <p
              className={`num text-xl font-bold ${
                overBudget ? "text-rose-fg" : "text-ink"
              }`}
            >
              {total.toFixed(2)}
            </p>

            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
              <div
                className={`bar-grow h-full rounded-full bg-gradient-to-r ${
                  overBudget
                    ? "from-rose-500 to-red-500"
                    : "from-indigo-400 to-violet-400"
                }`}
                style={{
                  width: `${
                    scaleMax > 0
                      ? Math.min((total / scaleMax) * 100, 100)
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-line-soft pt-2.5">
              <span className="text-[11px] uppercase tracking-wider text-ink-faint">
                Saving
              </span>

              <span
                className={`num text-sm font-bold ${
                  saved > 0 ? "text-emerald-fg" : "text-rose-fg"
                }`}
              >
                {saved.toFixed(2)}
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-ink-faint">
                Daily Save
              </span>

              <span
                className={`num text-xs font-medium ${
                  dailySaved > 0 ? "text-emerald-fg" : "text-rose-fg"
                }`}
              >
                {dailySaved.toFixed(2)}
              </span>
            </div>
          </button>
          );
        })}
      </div>

      <Modal
        open={activeWeek !== null}
        size="lg"
        onClose={() => setActiveWeek(null)}
        title={
          activeWeek ? WEEK_LABELS[activeWeek] : ""
        }
      >
        {activeItems.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-faint">
            No expenses recorded this week.
          </p>
        ) : (
          <div className="scroll-slim max-h-80 space-y-2 overflow-y-auto pr-1">
            <div className="flex items-center justify-end gap-3 px-3 text-[10px] uppercase tracking-wider text-ink-faint sm:gap-3">
              <span className="sm:w-24 sm:text-right">Daily Saving</span>
              <span className="sm:w-20 sm:text-right">Spent</span>
            </div>

            {activeItems.map((item) => (
              // Narrow screens stack the row into two lines (date + name,
              // then the figures) because four fixed columns overflow a
              // 375px viewport and clip the amount.
              <div
                key={item.id}
                className="flex flex-col gap-1.5 rounded-xl border border-line-soft bg-inset px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:gap-3"
              >
                <div className="flex min-w-0 items-center justify-between gap-2.5 sm:flex-1">
                  <span className="shrink-0 text-xs font-medium text-ink-faint sm:w-28">
                    {formatDate(item.date)}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-right font-medium text-ink">
                    {item.typeName}
                  </span>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <span className="text-xs sm:w-24 sm:text-right">
                    {item.extraSave === null ? (
                      <span className="text-ink-faint">—</span>
                    ) : Number(item.extraSave) >= 0 ? (
                      <span className="num rounded-full bg-emerald-soft px-2 py-0.5 font-medium text-emerald-fg ring-1 ring-inset ring-emerald-line">
                        +{Number(item.extraSave).toFixed(2)}
                      </span>
                    ) : (
                      <span className="num rounded-full bg-rose-soft px-2 py-0.5 font-medium text-rose-fg ring-1 ring-inset ring-rose-line">
                        {Number(item.extraSave).toFixed(2)}
                      </span>
                    )}
                  </span>

                  <span className="num shrink-0 text-right font-bold text-ink sm:w-20">
                    {Number(item.total).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3">
          <span className="num rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted ring-1 ring-inset ring-line">
            {activeItems.length} Records
          </span>

          <span className="num rounded-full bg-indigo-soft px-2.5 py-1 text-[11px] font-medium text-indigo-fg ring-1 ring-inset ring-indigo-line">
            Weekly Budget {budget.toFixed(2)}
          </span>

          <span
            className={`num rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${
              activeSaved >= 0
                ? "bg-emerald-soft text-emerald-fg ring-emerald-line"
                : "bg-rose-soft text-rose-fg ring-rose-line"
            }`}
          >
            Saved {activeSaved.toFixed(2)}
          </span>

          {activeOverBudget && (
            <span className="num rounded-full bg-rose-soft px-2.5 py-1 text-[11px] font-medium text-rose-fg ring-1 ring-inset ring-rose-line">
              +{activeOverPercent.toFixed(0)}% Over
            </span>
          )}

          <span className="num rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted ring-1 ring-inset ring-line">
             Budget {daily.toFixed(2)}
          </span>

          <span
            className={`num rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${
              activeDailySaved >= 0
                ? "bg-emerald-soft text-emerald-fg ring-emerald-line"
                : "bg-rose-soft text-rose-fg ring-rose-line"
            }`}
          >
            Save {activeDailySaved.toFixed(2)}
          </span>
        </div>
      </Modal>
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
