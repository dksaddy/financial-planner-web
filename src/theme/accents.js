// Shared accent palette. Every card picks one hue and uses it for its icon
// chip, corner glow and inner highlights so sections stay distinguishable
// while still reading as one system.
//
// `grad`/`glow` stay saturated in both themes because they always sit under
// white text on a filled chip. Everything else resolves through the theme
// tokens in `theme.css`, so the same class works on paper and in the dark.
export const ACCENTS = {
  slate: {
    grad: "from-slate-400 to-slate-500",
    glow: "shadow-slate-500/20",
    text: "text-slate-fg",
    dot: "bg-slate-dot",
    soft: "bg-slate-soft",
    line: "ring-slate-line",
  },
  indigo: {
    grad: "from-indigo-400 to-violet-500",
    glow: "shadow-indigo-500/30",
    text: "text-indigo-fg",
    dot: "bg-indigo-dot",
    soft: "bg-indigo-soft",
    line: "ring-indigo-line",
  },
  emerald: {
    grad: "from-emerald-400 to-teal-500",
    glow: "shadow-emerald-500/30",
    text: "text-emerald-fg",
    dot: "bg-emerald-dot",
    soft: "bg-emerald-soft",
    line: "ring-emerald-line",
  },
  amber: {
    grad: "from-amber-400 to-orange-500",
    glow: "shadow-amber-500/30",
    text: "text-amber-fg",
    dot: "bg-amber-dot",
    soft: "bg-amber-soft",
    line: "ring-amber-line",
  },
  sky: {
    grad: "from-sky-400 to-cyan-500",
    glow: "shadow-sky-500/30",
    text: "text-sky-fg",
    dot: "bg-sky-dot",
    soft: "bg-sky-soft",
    line: "ring-sky-line",
  },
  cyan: {
    grad: "from-cyan-400 to-blue-500",
    glow: "shadow-cyan-500/30",
    text: "text-cyan-fg",
    dot: "bg-cyan-dot",
    soft: "bg-cyan-soft",
    line: "ring-cyan-line",
  },
  fuchsia: {
    grad: "from-fuchsia-400 to-pink-500",
    glow: "shadow-fuchsia-500/30",
    text: "text-fuchsia-fg",
    dot: "bg-fuchsia-dot",
    soft: "bg-fuchsia-soft",
    line: "ring-fuchsia-line",
  },
  violet: {
    grad: "from-violet-400 to-purple-500",
    glow: "shadow-violet-500/30",
    text: "text-violet-fg",
    dot: "bg-violet-dot",
    soft: "bg-violet-soft",
    line: "ring-violet-line",
  },
  rose: {
    grad: "from-rose-400 to-red-500",
    glow: "shadow-rose-500/30",
    text: "text-rose-fg",
    dot: "bg-rose-dot",
    soft: "bg-rose-soft",
    line: "ring-rose-line",
  },
};

export const accent = (name) => ACCENTS[name] || ACCENTS.slate;
