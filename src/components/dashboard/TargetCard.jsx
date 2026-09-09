"use client";

import { useRouter } from "next/navigation";
import { FiTarget, FiArrowUpRight } from "react-icons/fi";

import Section from "./Section";

export default function TargetCard({
  targets,
  extraSaving,
  className = "",
}) {
  const router = useRouter();

  const availableSaving = Number(extraSaving?.totalExtraSave) || 0;

  return (
    <Section
      title="Target"
      icon={FiTarget}
      accent="fuchsia"
      className={className}
      actions={
        <button
          type="button"
          onClick={() => router.push("/dashboard/targets")}
          className="flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-line-soft bg-inset px-3 text-[13.2px] font-bold uppercase tracking-wider text-ink-muted transition hover:border-fuchsia-line hover:bg-fuchsia-soft hover:text-fuchsia-fg active:scale-95"
        >
          View All
          <FiArrowUpRight size={13} strokeWidth={2.6} />
        </button>
      }
    >
      {targets.pendingTargets.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-faint">
          No pending targets.
        </p>
      ) : (
        <div className="space-y-2">
          {targets.pendingTargets.map((target) => {
            const targetAmount = Number(target.target_amount) || 0;
            const percent =
              targetAmount > 0
                ? Math.min((availableSaving / targetAmount) * 100, 100)
                : 0;

            return (
              <div
                key={target.id}
                className="rounded-xl border border-line-soft bg-inset px-3.5 py-2.5 transition hover:border-fuchsia-line hover:bg-fuchsia-soft"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {target.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={target.image_url}
                        alt={target.name}
                        className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-line"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-fuchsia-soft text-fuchsia-fg ring-1 ring-line">
                        <FiTarget size={16} />
                      </span>
                    )}

                    <span className="truncate text-sm font-medium text-ink">
                      {target.name}
                    </span>
                  </div>

                  <span className="num shrink-0 text-base font-bold text-fuchsia-fg">
                    {targetAmount.toFixed(2)}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-soft">
                    <div
                      className="bar-grow h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-pink-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="num shrink-0 text-[13.2px] font-bold text-fuchsia-fg">
                    {percent.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            <span className="rounded-full bg-surface px-2.5 py-1 text-[13.2px] font-medium text-ink-muted ring-1 ring-inset ring-line">
              {targets.totalPendingTargets} pending
            </span>

            <span className="num rounded-full bg-fuchsia-soft px-2.5 py-1 text-[13.2px] font-medium text-fuchsia-fg ring-1 ring-inset ring-fuchsia-line">
              total {Number(targets.totalTargetAmount).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </Section>
  );
}