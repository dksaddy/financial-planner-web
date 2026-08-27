import Section from "./Section";

export default function TargetCard({
  targets,
  className = "",
}) {
  return (
    <Section
      title="Target"
      className={className}
    >
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
              <span className="w-1/2 truncate text-gray-700">
                {target.name}
              </span>

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