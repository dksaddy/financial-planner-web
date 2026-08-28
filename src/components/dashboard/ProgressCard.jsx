import Section from "./Section";

const COLORS = {
  saving: "#0ea5e9", // sky-500
  spending: "#1e293b", // slate-800
  remaining: "#e5e7eb", // gray-200
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
    <Section title="Progress">
      <div className="flex min-h-[120px] flex-col items-center justify-center gap-5 sm:flex-row">
        <div
          className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
          style={{ background: salary > 0 ? gradient : COLORS.remaining }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
            <span className="text-sm font-semibold text-gray-800">
              {salary > 0 ? `${Math.round(allocatedPercent)}%` : "—"}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          {legend.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />

              <span className="w-20 text-gray-500">
                {item.label}
              </span>

              <span className="w-10 font-medium text-gray-800">
                {item.percent.toFixed(0)}%
              </span>

              <span className="text-gray-400">
                {item.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}