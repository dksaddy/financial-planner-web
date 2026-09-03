import { accent as resolveAccent } from "@/theme/accents";

export default function Row({
  label,
  value,
  prefix = "",
  suffix = "",
  accent = "slate",
  emphasis = false,
}) {
  const numericValue = Number(value ?? 0);

  const tone = resolveAccent(accent);

  return (
    <div className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-hover">
      <span className="flex min-w-0 items-center gap-2 text-[13px] text-ink-muted">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />

        <span className="truncate">{label}</span>
      </span>

      <span
        className={`num shrink-0 font-bold ${
          emphasis
            ? `text-[19px] leading-none ${tone.text}`
            : "text-[15px] text-ink"
        }`}
      >
        {prefix}
        {numericValue.toFixed(2)}
        {suffix}
      </span>
    </div>
  );
}
