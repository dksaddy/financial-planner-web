import { SAVING_PLAN_STATUS } from "@/constants/status";

// Tax taken from a plan's profit. Charged per plan and only on a gain, so a
// plan that loses money pays nothing and does not offset another plan's tax.
export const PROFIT_TAX_RATE = 0.15;

export const profitTax = (profit) =>
  Math.max(Number(profit) || 0, 0) * PROFIT_TAX_RATE;

// Mirrors `assertStatusTransition` in the API's savingPlans.service.js, so
// the card only offers moves the server will accept:
// active → completed, completed → active while money is still owed,
// completed → withdrawn, and withdrawn is final.
export const canChangeStatus = (plan, status) => {
  if (
    plan.status === status ||
    plan.status === SAVING_PLAN_STATUS.WITHDRAWN
  ) {
    return false;
  }

  if (status === SAVING_PLAN_STATUS.WITHDRAWN) {
    return plan.status === SAVING_PLAN_STATUS.COMPLETED;
  }

  if (status === SAVING_PLAN_STATUS.ACTIVE) return plan.remaining > 0;

  return true;
};

// `GET /saving-plans` returns raw snake_case rows, while `/dashboard` returns
// plans the API has already derived (percentage, remaining, profit). Both feed
// the same card, so normalize either shape here — the maths mirrors
// dashboard.service.js and must stay in step with it.
export const normalizeSavingPlan = (plan) => {
  const depositAmount = Number(
    plan.deposit_amount ?? plan.depositAmount ?? 0
  );

  const currentlyDeposited = Number(
    plan.currently_deposited ?? plan.currentlyDeposited ?? 0
  );

  const withdrawalAmount = Number(
    plan.withdrawal_amount ?? plan.withdrawalAmount ?? 0
  );

  const remaining = Math.max(depositAmount - currentlyDeposited, 0);

  const percentage =
    depositAmount > 0
      ? Math.min((currentlyDeposited / depositAmount) * 100, 100)
      : 0;

  return {
    id: plan.id,
    name: plan.name,
    status: plan.status,
    amount: Number(plan.amount),
    frequency: Number(plan.frequency),
    months: Number(plan.months),
    depositAmount,
    depositFrequency: Number(
      plan.deposit_frequency ?? plan.depositFrequency ?? 0
    ),
    currentlyDeposited,
    withdrawalAmount,
    profit: Number((withdrawalAmount - depositAmount).toFixed(2)),
    remaining: Number(remaining.toFixed(2)),
    percentage: Number(percentage.toFixed(2)),
    createdAt: plan.created_at ?? plan.createdAt ?? null,
  };
};
