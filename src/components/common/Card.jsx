export default function Card({
  title,
  children,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-8 shadow-panel">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 opacity-[0.12] blur-2xl"
      />

      {title && (
        <h2 className="relative mb-6 text-center text-2xl font-bold uppercase tracking-[0.08em] text-ink">
          {title}
        </h2>
      )}

      <div className="relative">{children}</div>
    </div>
  );
}
