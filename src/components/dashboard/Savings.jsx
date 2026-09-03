"use client";

import { useState } from "react";
import { FiPlus, FiTrendingUp } from "react-icons/fi";

import Section from "./Section";
import AddSavingPlanModal from "./AddSavingPlanModal";

export default function Savings({
  plans,
  onAdded,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const savingPlans = plans || [];

  return (
    <Section
      title="Savings"
      icon={FiTrendingUp}
      accent="emerald"
      actions={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50 hover:brightness-110 active:scale-95"
          aria-label="Add saving plan"
        >
          <FiPlus size={16} strokeWidth={2.6} />
        </button>
      }
    >
      <AddSavingPlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onAdded}
      />

      {savingPlans.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-faint">
          No saving plans yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savingPlans.map((plan) => (
            <div
              key={plan.id}
              className="group/plan relative overflow-hidden rounded-xl border border-line-soft bg-inset p-4 transition-[background-color,border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface hover:shadow-card"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-[0.12] blur-2xl"
              />

              {/* Header */}
              <div className="relative flex items-start justify-between gap-2">
                <p className="truncate text-base font-bold text-ink">
                  {plan.name}
                </p>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${statusStyles(
                    plan.status
                  )}`}
                >
                  {plan.status}
                </span>
              </div>

              {/* Deposit progress */}
              <div className="relative mt-4">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="num text-2xl font-bold text-emerald-fg">
                    {plan.percentage.toFixed(0)}%
                  </span>

                  <span className="num text-xs text-ink-muted">
                    {plan.currentlyDeposited.toFixed(2)} deposited
                  </span>
                </div>

                <div className="relative flex h-2.5 w-full overflow-hidden rounded-full bg-line-soft ring-1 ring-inset ring-line-soft">
                  <div
                    className="bar-grow relative h-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                    style={{ width: `${plan.percentage}%` }}
                  >
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="relative mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-line-soft pt-3.5">
                <Stat
                  label="Contribution"
                  value={`${Number(plan.amount).toFixed(2)} / ${frequencyLabel(plan.frequency)}`}
                />

                <Stat
                  label="Duration"
                  value={`${plan.months} month${plan.months === 1 ? "" : "s"}`}
                />

                <Stat
                  label="Deposit Target"
                  value={plan.depositAmount.toFixed(2)}
                />

                <Stat
                  label="Deposit Frequency"
                  value={`Every ${frequencyLabel(plan.depositFrequency)}`}
                />

                <Stat
                  label="Remaining"
                  value={plan.remaining.toFixed(2)}
                />

                <Stat
                  label="Withdrawal"
                  value={plan.withdrawalAmount.toFixed(2)}
                />
              </div>

              {/* Profit footer */}
              <div className="relative mt-3.5 flex items-center justify-between border-t border-line-soft pt-3.5">
                <span className="text-[11px] uppercase tracking-wider text-ink-faint">
                  Projected Profit
                </span>

                <span
                  className={`num rounded-lg px-2.5 py-1 text-sm font-bold ring-1 ring-inset ${
                    plan.profit >= 0
                      ? "bg-emerald-soft text-emerald-fg ring-emerald-line"
                      : "bg-rose-soft text-rose-fg ring-rose-line"
                  }`}
                >
                  {plan.profit >= 0 ? "+" : ""}
                  {plan.profit.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[10px] uppercase tracking-wider text-ink-faint">
        {label}
      </p>

      <p className="num truncate text-sm font-bold text-ink">
        {value}
      </p>
    </div>
  );
}

function frequencyLabel(frequency) {
  const days = Number(frequency);

  if (days === 7) return "week";
  if (days === 30) return "month";

  return `${days} days`;
}

function statusStyles(status) {
  switch (status) {
    case "active":
      return "bg-emerald-soft text-emerald-fg ring-emerald-line";
    case "completed":
      return "bg-sky-soft text-sky-fg ring-sky-line";
    case "cancelled":
      return "bg-slate-soft text-ink-muted ring-slate-line";
    default:
      return "bg-slate-soft text-ink-muted ring-slate-line";
  }
}
