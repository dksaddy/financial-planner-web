import { FiCheck } from "react-icons/fi";

import SectionHeading from "@/components/landing/SectionHeading";

const BENEFITS = [
  {
    title: "A number you can spend against",
    body: "Not a monthly pot you burn through by the 12th — a daily figure that already has your savings taken out of it.",
  },
  {
    title: "Underspending finally pays",
    body: "Skipping a takeaway is not a vague win. The difference lands in Extra Saving the same day and shows up on the dashboard.",
  },
  {
    title: "Goals with a funding source",
    body: "Targets are not a wishlist. They draw on real surplus, so progress moves only when your spending actually leaves room.",
  },
  {
    title: "No monthly re-entry",
    body: "Expense types are reusable and their totals are frozen once created, so old records never shift under you.",
  },
  {
    title: "Honest history",
    body: "Records are kept, never quietly deleted — types are deactivated instead, so last quarter still adds up.",
  },
  {
    title: "One screen, day or night",
    body: "Every card in one view, in a light or dark theme that follows your system and remembers what you picked.",
  },
];

export default function Benefits() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Why it helps"
        title="What changes for you"
        description="The point is not prettier charts. It is knowing, before you spend, whether you can."
      />

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit, index) => (
          <div
            key={benefit.title}
            className="reveal flex gap-3.5"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-line bg-emerald-soft text-emerald-fg">
              <FiCheck size={14} strokeWidth={3} />
            </span>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-ink">{benefit.title}</h3>

              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {benefit.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
