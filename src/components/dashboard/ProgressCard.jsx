import Section from "./Section";

function ProgressCircle({
  label,
  value,
  max,
}) {
  const percentage =
    max > 0
      ? Math.min((Number(value) / Number(max)) * 100, 100)
      : 0;

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div
        className="relative flex h-24 w-24 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(
            #111827 ${percentage}%,
            #e5e7eb ${percentage}% 100%
          )`,
        }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
          <span className="text-sm font-semibold text-gray-800">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        {label}
      </p>
    </div>
  );
}

export default function ProgressCard({
  saving,
  spending,
}) {
  return (
    <Section title="Progress">
      <div className="flex min-h-[120px] items-center justify-center gap-3">
        <ProgressCircle
          label="Saving"
          value={saving.totalMonthlySaving}
          max={spending.salary}
        />

        <ProgressCircle
          label="Spending"
          value={spending.monthly}
          max={spending.salary}
        />
      </div>
    </Section>
  );
}