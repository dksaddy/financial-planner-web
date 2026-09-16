import { FiCheckCircle, FiTrendingUp } from "react-icons/fi";

import Section from "./Section";
import Row from "./Row";

import { SAVING_PLAN_STATUS } from "@/constants/status";

// Totals for a group of normalized plans (see lib/savingPlan.js). Profit is
// withdrawal minus the plan's total deposit amount, as on the plan cards. Tax
// is each plan's own, worked out at its own rate before summing, so one plan's
// loss never reduces another plan's tax.
const summarize = (plans) => {
  const totals = plans.reduce(
    (sum, plan) => ({
      depositAmount: sum.depositAmount + plan.depositAmount,
      deposited: sum.deposited + plan.currentlyDeposited,
      remaining: sum.remaining + plan.remaining,
      withdrawal: sum.withdrawal + plan.withdrawalAmount,
      tax: sum.tax + plan.tax,
    }),
    { depositAmount: 0, deposited: 0, remaining: 0, withdrawal: 0, tax: 0 }
  );

  const profit = totals.withdrawal - totals.depositAmount;

  return {
    ...totals,
    profit,
    inHand: totals.withdrawal - totals.tax,
    netProfit: profit - totals.tax,
  };
};

// Two views over every plan, ignoring the page's filter: what withdrawn plans
// paid out after tax, and what active and completed plans will pay out once
// they are withdrawn and taxed.
export default function SavingPlansSummary({ plans = [] }) {
  const withdrawnPlans = plans.filter(
    (plan) => plan.status === SAVING_PLAN_STATUS.WITHDRAWN
  );
  const upcomingPlans = plans.filter(
    (plan) => plan.status !== SAVING_PLAN_STATUS.WITHDRAWN
  );

  const completedCount = upcomingPlans.filter(
    (plan) => plan.status === SAVING_PLAN_STATUS.COMPLETED
  ).length;

  const earned = summarize(withdrawnPlans);
  const upcoming = summarize(upcomingPlans);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Section
        title="Earned"
        icon={FiCheckCircle}
        accent="violet"
        actions={<Chip>{withdrawnPlans.length} withdrawn</Chip>}
      >
        <div className="space-y-1">
          <Row label="Deposited" value={earned.depositAmount} accent="emerald" />
          <Row label="Withdrawn" value={earned.withdrawal} accent="violet" />
          <Row label="Profit" value={earned.profit} accent={toneOf(earned.profit)} />
          <Row label="Tax paid" value={-earned.tax} accent="rose" />
          <Row label="Received in hand" value={earned.inHand} accent="sky" />

          <Total label="Net Profit" value={earned.netProfit} />
        </div>
      </Section>

      <Section
        title="Upcoming"
        icon={FiTrendingUp}
        accent="emerald"
        actions={
          <Chip>
            {upcomingPlans.length - completedCount} active · {completedCount}{" "}
            completed
          </Chip>
        }
      >
        <div className="space-y-1">
          <Row label="Deposited so far" value={upcoming.deposited} accent="emerald" />
          <Row label="Left to deposit" value={upcoming.remaining} accent="amber" />
          <Row label="Will withdraw" value={upcoming.withdrawal} accent="sky" />
          <Row label="Profit" value={upcoming.profit} accent={toneOf(upcoming.profit)} />
          <Row
            label="Tax on withdrawal"
            value={-upcoming.tax}
            accent="rose"
          />
          <Row label="In hand after tax" value={upcoming.inHand} accent="sky" />

          <Total label="Net Profit" value={upcoming.netProfit} />
        </div>
      </Section>
    </div>
  );
}

function Total({ label, value }) {
  return (
    <div className="mt-2 border-t border-line pt-2">
      <Row label={label} value={value} accent={toneOf(value)} emphasis />
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="num rounded-full bg-surface px-2.5 py-1 text-[12.54px] font-medium text-ink-muted ring-1 ring-inset ring-line">
      {children}
    </span>
  );
}

function toneOf(value) {
  return value < 0 ? "rose" : "emerald";
}
