"use client";

import { useState } from "react";

import Section from "./Section";
import DepositModal from "./DepositModal";

export default function SavingPlanOverview({
  plans,
  onDeposit,
}) {
  const [activePlan, setActivePlan] = useState(null);

  const activePlans = (plans || []).filter(
    (plan) => plan.status === "active"
  );

  return (
    <Section title="Overview">
      <DepositModal
        open={Boolean(activePlan)}
        onClose={() => setActivePlan(null)}
        onSuccess={onDeposit}
        plan={activePlan}
      />

      {activePlans.length === 0 ? (
        <p className="text-sm text-gray-400">
          No active saving plans yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {activePlans.map((plan) => (
            <div key={plan.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-gray-700">
                  {plan.name}
                </p>

                <button
                  type="button"
                  onClick={() => setActivePlan(plan)}
                  className="shrink-0 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Deposit
                </button>
              </div>

              <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-sky-400"
                  style={{
                    width: `${plan.percentage}%`,
                  }}
                />

                <div
                  className="h-full bg-lime-300"
                  style={{
                    width: `${100 - plan.percentage}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-sm font-semibold text-gray-900">
                <span>
                  {plan.currentlyDeposited.toFixed(2)}
                </span>

                <span>
                  {plan.remaining.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}