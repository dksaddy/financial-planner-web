import { FiTrendingUp } from "react-icons/fi";

// A still of the real dashboard maths: salary in, savings carved out, the
// remainder spread over the month's working days. The figures are an example,
// not live data.
const ROWS = [
  { label: "Weekly saving × 4", value: "8,000.00", tone: "text-ink-muted" },
  { label: "Monthly saving", value: "5,000.00", tone: "text-ink-muted" },
  { label: "Spendable", value: "32,000.00", tone: "text-emerald-fg" },
];

const WEEK = [
  { day: "Sat", percent: 72 },
  { day: "Sun", percent: 48 },
  { day: "Mon", percent: 95 },
  { day: "Tue", percent: 60 },
  { day: "Wed", percent: 38 },
  { day: "Thu", percent: 81 },
];

export default function BudgetPreview() {
  return (
    <div className="relative">
      {/* Corner brackets — the HUD frame around the panel. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-2 h-8 w-8 rounded-tl-2xl border-l-2 border-t-2 border-indigo-line"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 rounded-br-2xl border-b-2 border-r-2 border-fuchsia-line"
      />

      <div className="relative overflow-hidden rounded-2xl border border-line bg-panel p-6 shadow-panel">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 opacity-[0.14] blur-2xl"
        />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
              <FiTrendingUp size={15} strokeWidth={2.4} />
            </span>

            <h2 className="text-[15.6px] font-bold uppercase tracking-[0.14em] text-ink-muted">
              This Month
            </h2>
          </div>

          <span className="rounded-md border border-emerald-line bg-emerald-soft px-2 py-1 text-[12px] font-bold uppercase tracking-wider text-emerald-fg">
            On track
          </span>
        </div>

        <div className="relative mt-5">
          <p className="text-[13.2px] font-bold uppercase tracking-wider text-ink-faint">
            Salary
          </p>

          <p className="num mt-1 text-4xl font-bold text-ink">45,000.00</p>
        </div>

        <ul className="relative mt-5 space-y-2.5 border-t border-line-soft pt-4">
          {ROWS.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-sm text-ink-muted">{row.label}</span>

              <span className={`num text-sm font-bold ${row.tone}`}>
                {row.value}
              </span>
            </li>
          ))}
        </ul>

        <div className="relative mt-4 rounded-xl border border-line-soft bg-inset p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[13.2px] font-bold uppercase tracking-wider text-ink-faint">
                Daily budget
              </p>

              <p className="num mt-1 text-2xl font-bold text-indigo-fg">
                1,230.77
              </p>
            </div>

            <p className="text-right text-[13.2px] leading-tight text-ink-faint">
              32,000 ÷ 26
              <br />
              working days
            </p>
          </div>

          <div className="mt-4 flex items-end justify-between gap-2">
            {WEEK.map((entry) => (
              <div
                key={entry.day}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                {/* `bar-grow` sweeps on the X axis, so these vertical bars
                    stay static rather than growing sideways. */}
                <div className="flex h-20 w-full items-end justify-center rounded-md bg-surface">
                  <span
                    className="w-full rounded-md bg-gradient-to-t from-indigo-500 to-violet-400"
                    style={{ height: `${entry.percent}%` }}
                  />
                </div>

                <span className="text-[12px] uppercase tracking-wider text-ink-faint">
                  {entry.day}
                </span>
              </div>
            ))}
          </div>

          <p className="rule-dashed mt-4 pt-3 text-center text-[13.2px] text-ink-muted">
            Unspent today rolls into
            <span className="font-bold text-emerald-fg"> Extra Saving</span>
          </p>
        </div>
      </div>
    </div>
  );
}
