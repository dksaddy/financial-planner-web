"use client";

import { useState } from "react";
import { FiTarget, FiPlus } from "react-icons/fi";

import Section from "./Section";
import AddTargetModal from "./AddTargetModal";

export default function TargetCard({
  targets,
  onAdded,
  className = "",
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Section
      title="Target"
      icon={FiTarget}
      accent="fuchsia"
      className={className}
      actions={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/30 transition hover:shadow-fuchsia-500/50 hover:brightness-110 active:scale-95"
          aria-label="Add target"
        >
          <FiPlus size={16} strokeWidth={2.6} />
        </button>
      }
    >
      <AddTargetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onAdded}
      />

      {targets.pendingTargets.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-faint">
          No pending targets.
        </p>
      ) : (
        <div className="space-y-2">
          {targets.pendingTargets.map((target) => (
            <div
              key={target.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-inset px-3.5 py-2.5 transition hover:border-fuchsia-line hover:bg-fuchsia-soft"
            >
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
                {Number(target.target_amount).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted ring-1 ring-inset ring-line">
              {targets.totalPendingTargets} pending
            </span>

            <span className="num rounded-full bg-fuchsia-soft px-2.5 py-1 text-[11px] font-medium text-fuchsia-fg ring-1 ring-inset ring-fuchsia-line">
              total {Number(targets.totalTargetAmount).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </Section>
  );
}
