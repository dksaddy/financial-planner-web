import { accent as resolveAccent } from "@/theme/accents";

export default function Section({
  title,
  actions,
  children,
  icon: Icon,
  accent = "indigo",
  className = "",
}) {
  const tone = resolveAccent(accent);

  return (
    <section
      className={`group relative flex flex-col overflow-hidden rounded-2xl
      border border-line bg-surface p-5 shadow-card
      transition-colors duration-300
      hover:border-line-strong hover:bg-surface-hover
      ${className}`}
    >
      {/* Top hairline — catches the light along the card edge. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
      />

      {/* Accent bloom in the corner. Held at a fixed opacity: animating a
          blurred layer inside a backdrop-filtered card makes Chrome repaint the
          whole card on hover, which reads as a flash. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full
        bg-gradient-to-br ${tone.grad} opacity-[0.12] blur-2xl`}
      />

      <header className="relative mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon && (
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl
              bg-gradient-to-br ${tone.grad} text-white shadow-lg ${tone.glow}`}
            >
              <Icon size={15} strokeWidth={2.4} />
            </span>
          )}

          <h2 className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
            {title}
          </h2>
        </div>

        {actions}
      </header>

      <div className="relative flex-1">{children}</div>
    </section>
  );
}
