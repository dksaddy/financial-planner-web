import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

// A plan is either running or finished. The column and the API still accept
// "cancelled", so `statusStyles` keeps rendering it for any older row, but it
// is not something you can set from here any more.
const STATUSES = ["active", "completed"];

// The plan tile the dashboard's Savings section and the all-plans page both
// render, so a change to a plan's presentation lands in one place. The
// management handlers are optional — the dashboard renders a read-only card.
export default function SavingPlanCard({
  plan,
  onDeposit,
  onEdit,
  onDelete,
  onStatusChange,
  statusPending = false,
}) {
  return (
    <div className="group/plan relative overflow-hidden rounded-xl border border-line-soft bg-inset p-4 transition-[background-color,border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface hover:shadow-card">
      <span
        aria-hidden
        className="corner-bloom pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-[0.12] blur-2xl"
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-2">
        <p className="truncate text-base font-bold text-ink">
          {plan.name}
        </p>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11.4px] font-bold uppercase tracking-wider ring-1 ring-inset ${statusStyles(
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
          label="Deposit Amount"
          value={`${Number(plan.amount).toFixed(2)} / ${frequencyLabel(plan.frequency)}`}
        />

        <Stat
          label="Duration"
          value={`${plan.months} month${plan.months === 1 ? "" : "s"}`}
        />

        <Stat
          label="Total Deposit Amount"
          value={plan.depositAmount.toFixed(2)}
        />

        {/* A count of deposits, not a cadence — 250 × 26 is the 6500 total. */}
        <Stat
          label="Deposit Times"
          value={`${plan.depositFrequency}`}
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
        <span className="text-[12.54px] uppercase tracking-wider text-ink-faint">
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

      {/* Deposits are only accepted on active plans, so the button follows
          the same rule the API enforces. */}
      {onDeposit && plan.status === "active" && (
        <button
          type="button"
          onClick={() => onDeposit(plan)}
          className="group/btn relative mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12.54px] font-bold uppercase tracking-wider text-ink-muted transition hover:border-emerald-line hover:bg-emerald-soft hover:text-emerald-fg"
        >
          <FiPlus
            size={12}
            strokeWidth={2.6}
            className="transition-transform group-hover/btn:rotate-90"
          />
          Deposit
        </button>
      )}

      {(onEdit || onDelete) && (
        <div className="relative mt-2 flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(plan)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12.54px] font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink"
            >
              <FiEdit2 size={12} />
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(plan)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12.54px] font-bold uppercase tracking-wider text-ink-muted transition hover:border-rose-line hover:bg-rose-soft hover:text-rose-fg"
            >
              <FiTrash2 size={12} />
              Delete
            </button>
          )}
        </div>
      )}

      {onStatusChange && (
        <div className="relative mt-3 border-t border-line-soft pt-3">
          <p className="mb-2 text-[11.4px] uppercase tracking-wider text-ink-faint">
            Status
          </p>

          <div className="flex items-center gap-1.5">
            {STATUSES.map((status) => {
              const isCurrent = plan.status === status;

              return (
                <button
                  key={status}
                  type="button"
                  disabled={isCurrent || statusPending}
                  onClick={() => onStatusChange(plan, status)}
                  aria-pressed={isCurrent}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-[11.4px] font-bold uppercase tracking-wider transition disabled:cursor-not-allowed ${
                    isCurrent
                      ? `${statusStyles(status)} border-transparent opacity-100`
                      : "border-line text-ink-faint hover:border-line-strong hover:bg-surface-hover hover:text-ink disabled:opacity-50"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[11.4px] uppercase tracking-wider text-ink-faint">
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
