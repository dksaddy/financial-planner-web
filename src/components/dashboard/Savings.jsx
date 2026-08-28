"use client";

import { useState } from "react";

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
      actions={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
          aria-label="Add saving plan"
        >
          +
        </button>
      }
    >
      <AddSavingPlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onAdded}
      />

      {savingPlans.length === 0 ? (
        <p className="text-sm text-gray-400">
          No saving plans yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savingPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl border border-gray-200 p-4 text-sm shadow-sm transition hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-semibold text-gray-900">
                  {plan.name}
                </p>

                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles(
                    plan.status
                  )}`}
                >
                  {plan.status}
                </span>
              </div>

              {/* Deposit progress */}
              <div className="mt-3">
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${plan.percentage}%` }}
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {plan.currentlyDeposited.toFixed(2)} deposited
                  </span>

                  <span className="font-medium text-gray-700">
                    {plan.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-2 gap-y-3 border-t border-gray-100 pt-3">
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
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-500">
                  Projected Profit
                </span>

                <span
                  className={`text-sm font-semibold ${
                    plan.profit >= 0
                      ? "text-green-600"
                      : "text-red-500"
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
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
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
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}