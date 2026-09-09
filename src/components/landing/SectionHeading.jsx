export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-[12.54px] font-bold uppercase tracking-[0.22em] text-ink-faint">
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          {eyebrow}
          <span aria-hidden className="h-px w-6 bg-line-strong" />
        </span>
      )}

      <h2 className="mt-4 text-3xl font-bold uppercase tracking-[0.03em] text-ink sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
    </div>
  );
}
