"use client";

import { useState } from "react";
import { FiCreditCard, FiPlus } from "react-icons/fi";

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
    <Section
      title="Overview"
      icon={FiCreditCard}
      accent="indigo"
    >
      <DepositModal
        open={Boolean(activePlan)}
        onClose={() => setActivePlan(null)}
        onSuccess={onDeposit}
        plan={activePlan}
      />

      {activePlans.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-faint">
          No active saving plans yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {activePlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl border border-line-soft bg-inset p-4 transition hover:border-line-strong"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="truncate text-sm font-bold text-ink">
                  {plan.name}
                </p>

                <button
                  type="button"
                  onClick={() => setActivePlan(plan)}
                  className="group/btn flex shrink-0 items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50 active:scale-95"
                >
                  <FiPlus
                    size={12}
                    className="transition-transform group-hover/btn:rotate-90"
                  />
                  Deposit
                </button>
              </div>

              <div className="relative flex h-2.5 w-full overflow-hidden rounded-full bg-line-soft ring-1 ring-inset ring-line-soft">
                <div
                  className="bar-grow relative h-full overflow-hidden bg-gradient-to-r from-sky-400 to-cyan-300"
                  style={{
                    width: `${plan.percentage}%`,
                  }}
                >
                </div>

                <div
                  className="bar-grow h-full bg-gradient-to-r from-emerald-400/50 to-lime-300/50"
                  style={{
                    width: `${100 - plan.percentage}%`,
                  }}
                />
              </div>

              <div className="mt-2.5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-ink-faint">
                    Deposited
                  </p>

                  <p className="num text-base font-bold text-sky-fg">
                    {plan.currentlyDeposited.toFixed(2)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-ink-faint">
                    Remaining
                  </p>

                  <p className="num text-base font-bold text-ink-muted">
                    {plan.remaining.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
