"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiRepeat, FiArrowUpRight } from "react-icons/fi";

import Section from "./Section";
import ExpenseTypeDetailsModal from "./ExpenseTypeDetailsModal";

// Rank tints, brightest first, so the top expense type reads instantly.
const RANK_STYLES = [
  "from-amber-400 to-orange-500 shadow-amber-500/30",
  "from-orange-400 to-rose-500 shadow-orange-500/30",
  "from-rose-400 to-fuchsia-500 shadow-rose-500/30",
  "from-violet-400 to-indigo-500 shadow-violet-500/30",
];

export default function FrequentExpense({
  expenses = [],
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const slots = [
    ...expenses,
    ...Array(
      Math.max(0, 4 - expenses.length)
    ).fill(null),
  ].slice(0, 4);

  return (
    <Section
      title="Frequently Expense Type"
      icon={FiRepeat}
      accent="amber"
      actions={
        <button
          type="button"
          onClick={() => router.push("/dashboard/expense-types")}
          className="flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-line-soft bg-inset px-3 text-[12.54px] font-bold uppercase tracking-wider text-ink-muted transition hover:border-amber-line hover:bg-amber-soft hover:text-amber-fg active:scale-95"
        >
          View All
          <FiArrowUpRight size={13} strokeWidth={2.6} />
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {slots.map((expense, index) =>
          expense ? (
            <button
              key={expense.id}
              type="button"
              onClick={() => setSelected(expense)}
              aria-label={`View ${expense.name} details`}
              className="group/tile relative overflow-hidden rounded-xl border border-line-soft bg-inset p-4 text-left transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-inset-hover focus:outline-none focus-visible:border-line-strong focus-visible:ring-2 focus-visible:ring-amber-line"
            >
              <div className="mb-2.5 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                <p className="w-full truncate text-sm font-bold text-ink sm:w-auto">
                  {expense.name}
                </p>

                <span
                  className={`flex h-5 shrink-0 items-center rounded-md bg-gradient-to-br px-1.5 text-[11.4px] font-bold text-white shadow-md ${
                    RANK_STYLES[index] || RANK_STYLES[3]
                  }`}
                >
                  #{index + 1}
                </span>
              </div>

              <p className="num text-lg font-bold text-amber-fg">
                {Number(expense.totalAmount).toFixed(2)}
              </p>

              <p className="mt-1 text-[12.54px] text-ink-faint">
                <span className="num font-bold text-ink-muted">
                  {expense.frequency}x
                </span>{" "}
                this period
              </p>
            </button>
          ) : (
            <div
              key={`empty-${index}`}
              className="flex min-h-[104px] items-center justify-center rounded-xl border border-dashed border-line bg-inset"
            >
              <span className="text-xs text-ink-faint">N/A</span>
            </div>
          )
        )}
      </div>

      <ExpenseTypeDetailsModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        expenseType={selected}
      />
    </Section>
  );
}