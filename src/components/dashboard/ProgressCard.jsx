import { FiPieChart } from "react-icons/fi";

import Section from "./Section";

// Slice colours come from the theme tokens, so the donut repaints with the
// rest of the app when the mode flips.
const COLORS = {
  saving: "var(--cyan-dot)",
  spending: "var(--indigo-dot)",
  remaining: "var(--line-strong)",
};

export default function ProgressCard({
  saving,
  spending,
}) {
  const salary = Number(spending.salary) || 0;
  const totalSaving = Number(saving.totalMonthlySaving) || 0;
  const totalSpending = Number(spending.monthly) || 0;

  const savingPercentRaw = salary > 0 ? (totalSaving / salary) * 100 : 0;
  const spendingPercentRaw = salary > 0 ? (totalSpending / salary) * 100 : 0;

  // Saving + spending can exceed salary (over-budget months). Scale
  // both down proportionally so the pie always renders as a valid
  // 100% circle, while the legend still shows the real percentages.
  const combinedRaw = savingPercentRaw + spendingPercentRaw;
  const scale = combinedRaw > 100 ? 100 / combinedRaw : 1;

  const savingSlice = savingPercentRaw * scale;
  const spendingSlice = spendingPercentRaw * scale;

  const savingEnd = savingSlice;
  const spendingEnd = savingEnd + spendingSlice;

  const gradient = `conic-gradient(
    ${COLORS.saving} 0% ${savingEnd}%,
    ${COLORS.spending} ${savingEnd}% ${spendingEnd}%,
    ${COLORS.remaining} ${spendingEnd}% 100%
  )`;

  const remainingAmount = Math.max(salary - totalSaving - totalSpending, 0);
  const remainingPercentRaw = Math.max(
    100 - savingPercentRaw - spendingPercentRaw,
    0
  );

  const allocatedPercent = Math.min(
    savingPercentRaw + spendingPercentRaw,
    100
  );

  const legend = [
    {
      label: "Saving",
      color: COLORS.saving,
      percent: savingPercentRaw,
      value: totalSaving,
    },
    {
      label: "Spending",
      color: COLORS.spending,
      percent: spendingPercentRaw,
      value: totalSpending,
    },
    {
      label: "Remaining",
      color: COLORS.remaining,
      percent: remainingPercentRaw,
      value: remainingAmount,
    },
  ];

  return (
    <Section
      title="Progress"
      icon={FiPieChart}
      accent="sky"
    >
      <div className="flex min-h-[136px] flex-col items-center justify-center gap-6 sm:flex-row sm:justify-start">
        {/* Donut */}
        <div className="relative shrink-0">
          <span
            aria-hidden
            className="absolute -inset-3 rounded-full bg-gradient-to-br from-cyan-500/25 to-indigo-500/25 blur-xl"
          />

          <div
            className="relative flex h-32 w-32 items-center justify-center rounded-full shadow-card"
            style={{ background: salary > 0 ? gradient : COLORS.remaining }}
          >
            {/* Inner disc punches the ring out of the conic gradient. */}
            <div className="flex h-[86px] w-[86px] flex-col items-center justify-center rounded-full bg-panel ring-1 ring-line">
              <span className="num text-xl font-bold text-ink">
                {salary > 0 ? `${Math.round(allocatedPercent)}%` : "—"}
              </span>

              <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                allocated
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full min-w-0 space-y-2.5">
          {legend.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2 text-ink-muted">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}`,
                    }}
                  />
                  {item.label}
                </span>

                <span className="flex items-baseline gap-2">
                  <span className="num font-bold text-ink">
                    {item.percent.toFixed(0)}%
                  </span>

                  <span className="num w-16 text-right text-[11px] text-ink-faint">
                    {item.value.toFixed(2)}
                  </span>
                </span>
              </div>

              <div className="h-1 w-full overflow-hidden rounded-full bg-line-soft">
                <div
                  className="bar-grow h-full rounded-full"
                  style={{
                    width: `${Math.min(item.percent, 100)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
