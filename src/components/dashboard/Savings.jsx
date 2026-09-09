"use client";

import { useRouter } from "next/navigation";
import { FiTrendingUp, FiArrowUpRight } from "react-icons/fi";

import Section from "./Section";
import SavingPlanCard from "./SavingPlanCard";

export default function Savings({ plans }) {
  const router = useRouter();

  // The dashboard payload carries everything except completed plans; only
  // active ones belong on the dashboard, so cancelled plans are filtered out
  // here too. The all-plans page is where the rest live, along with adding,
  // editing and deleting.
  const savingPlans = (plans || []).filter(
    (plan) => plan.status === "active"
  );

  return (
    <Section
      title="Savings"
      icon={FiTrendingUp}
      accent="emerald"
      actions={
        <button
          type="button"
          onClick={() => router.push("/dashboard/savings")}
          className="flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-line-soft bg-inset px-3 text-[13.2px] font-bold uppercase tracking-wider text-ink-muted transition hover:border-emerald-line hover:bg-emerald-soft hover:text-emerald-fg active:scale-95"
        >
          View All
          <FiArrowUpRight size={13} strokeWidth={2.6} />
        </button>
      }
    >
      {savingPlans.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-faint">
          No active saving plans.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savingPlans.map((plan) => (
            <SavingPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </Section>
  );
}
