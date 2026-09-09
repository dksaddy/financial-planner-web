import {
  FiPieChart,
  FiRepeat,
  FiEdit3,
  FiTarget,
  FiTrendingUp,
  FiGrid,
} from "react-icons/fi";

import SectionHeading from "@/components/landing/SectionHeading";
import { accent as resolveAccent } from "@/theme/accents";

const FEATURES = [
  {
    icon: FiPieChart,
    accent: "indigo",
    title: "Saving Plans",
    body: "Run weekly and monthly plans side by side. Deposit into any plan and watch the balance climb without touching a spreadsheet.",
  },
  {
    icon: FiRepeat,
    accent: "amber",
    title: "Expense Types",
    body: "Build a spend once — groceries, transport, bills — with its own categories, then reuse it every time. Retire one and its history stays intact.",
  },
  {
    icon: FiEdit3,
    accent: "sky",
    title: "Expense Records",
    body: "Log a spend in seconds against a saved type. Browse month by month with running totals that cover the whole filtered set, not just the page.",
  },
  {
    icon: FiTarget,
    accent: "fuchsia",
    title: "Targets",
    body: "Name the thing you are saving for, give it a price and a picture, and let your unspent budget fund it instead of quietly disappearing.",
  },
  {
    icon: FiTrendingUp,
    accent: "emerald",
    title: "Extra Saving",
    body: "Every day you come in under budget, the difference is banked automatically. Completed targets are deducted, so the number is always the truth.",
  },
  {
    icon: FiGrid,
    accent: "violet",
    title: "One Dashboard",
    body: "This week's running spend, the last four weeks against budget, your most frequent expense types and every plan — on a single screen.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <SectionHeading
        eyebrow="Features"
        title="Everything the month needs"
        description="Six pieces that feed one another. Set them up once and the dashboard keeps itself honest."
      />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => {
          const tone = resolveAccent(feature.accent);
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="reveal group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-card transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-hover"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
              />

              <span
                aria-hidden
                className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${tone.grad} opacity-[0.12] blur-2xl`}
              />

              <span
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tone.grad} text-white shadow-lg ${tone.glow}`}
              >
                <Icon size={17} strokeWidth={2.3} />
              </span>

              <h3 className="relative mt-4 text-[18px] font-bold uppercase tracking-[0.12em] text-ink">
                {feature.title}
              </h3>

              <p className="relative mt-2.5 text-sm leading-relaxed text-ink-muted">
                {feature.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
