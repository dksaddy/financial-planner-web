import { accent as resolveAccent } from "@/theme/accents";

// The figures under an "All …" page title. Every list page states them as the
// same row of chips, so a count, a total and a saving read alike wherever they
// appear. Spaced off the title and between wrapped rows, since a chip is
// taller than a line of text and Morphism's shadow spills past its edge.
export function HeaderChips({ children }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2.5">
      {children}
    </div>
  );
}

// Neutral by default. `accent` tints it with a card hue; `tone` takes a ready
// set of colour classes instead, for a figure whose colour depends on its value
// (see `signTone` in lib/tone.js).
export function HeaderChip({ accent, tone, children }) {
  const colours = tone
    ? tone
    : accent
      ? (({ soft, text, line }) => `${soft} ${text} ${line}`)(resolveAccent(accent))
      : "bg-surface text-ink-muted ring-line";

  return (
    <span
      className={`num rounded-full px-2.5 py-1 text-[12.54px] font-medium ring-1 ring-inset ${colours}`}
    >
      {children}
    </span>
  );
}
