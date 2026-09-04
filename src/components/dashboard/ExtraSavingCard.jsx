import { FiZap } from "react-icons/fi";

import Section from "./Section";
import Row from "./Row";

export default function ExtraSavingCard({ extraSaving, targets }) {
  const totalExtraSave = Number(extraSaving.totalExtraSave) || 0;
  const totalTargetAmount = Number(targets?.totalTargetAmount) || 0;
  const isDeficit = totalExtraSave < 0;

  const coveredPercent =
    totalTargetAmount > 0
      ? Math.min((Math.abs(totalExtraSave) / totalTargetAmount) * 100, 100)
      : 0;

  const sliceColor = isDeficit ? "var(--rose-dot)" : "var(--emerald-dot)";

  const gradient = `conic-gradient(
    ${sliceColor} 0% ${coveredPercent}%,
    var(--line-strong) ${coveredPercent}% 100%
  )`;

  return (
    <Section
      title="Total Extra Save"
      icon={FiZap}
      accent="violet"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative shrink-0">
          <span
            aria-hidden
            className={`absolute -inset-3 rounded-full blur-xl ${
              isDeficit
                ? "bg-gradient-to-br from-rose-500/25 to-pink-500/25"
                : "bg-gradient-to-br from-emerald-500/25 to-teal-500/25"
            }`}
          />

          <div
            className="relative flex h-36 w-36 items-center justify-center rounded-full shadow-card"
            style={{
              background: totalTargetAmount > 0 ? gradient : "var(--line-strong)",
            }}
          >
            <div className="flex h-[93px] w-[93px] flex-col items-center justify-center rounded-full bg-panel ring-1 ring-line">
              <span
                className={`num text-lg font-bold ${
                  isDeficit ? "text-rose-fg" : "text-emerald-fg"
                }`}
              >
                {coveredPercent.toFixed(0)}%
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-ink-faint">
                of target
              </span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-1">
          <Row
            label="Extra Save"
            value={extraSaving.totalExtraSave}
            accent="violet"
            emphasis
          />

          <Row
            label="Target Deduction"
            value={extraSaving.totalDeductedByTargets}
            accent="rose"
          />
        </div>
      </div>
    </Section>
  );
}