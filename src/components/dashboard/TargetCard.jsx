"use client";

import { useState } from "react";

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
      className={className}
      actions={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
          aria-label="Add target"
        >
          +
        </button>
      }
    >
      <AddTargetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onAdded}
      />

      {targets.pendingTargets.length === 0 ? (
        <p className="text-sm text-gray-400">
          No pending targets.
        </p>
      ) : (
        <div className="space-y-3">
          {targets.pendingTargets.map((target) => (
            <div
              key={target.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex w-1/2 items-center gap-2 truncate">
                {target.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={target.image_url}
                    alt={target.name}
                    className="h-10 w-10 shrink-0 rounded-sm object-cover"
                  />
                )}

                <span className="truncate text-gray-700">
                  {target.name}
                </span>
              </div>

              <span className="w-1/3 text-right font-medium text-gray-900">
                {Number(target.target_amount).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="border-t border-gray-100 pt-2">
            <p className="text-xs text-gray-400">
              {targets.totalPendingTargets} pending
              {" · "}
              total {Number(targets.totalTargetAmount).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </Section>
  );
}