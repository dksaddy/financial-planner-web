import {
  FiCalendar,
  FiClock,
  FiImage,
  FiLock,
  FiArchive,
  FiFlag,
} from "react-icons/fi";

import SectionHeading from "@/components/landing/SectionHeading";

// The steps above say how to drive; these are the walls. Every line is a
// refusal the API actually enforces, put here so it is read once rather than
// met as a red toast on the first day.
const RULES = [
  {
    icon: FiCalendar,
    title: "One record a day",
    body: "A day holds one expense record, and a week — Saturday to Friday — holds as many as the working days you set. Six days means six records.",
  },
  {
    icon: FiClock,
    title: "Nothing dated ahead",
    body: "A record says what you spent, so the date stops at today. Tomorrow's shopping is logged tomorrow.",
  },
  {
    icon: FiLock,
    title: "Money moves ask for your password",
    body: "Creating, editing, depositing into, withdrawing or deleting a saving plan is confirmed with your account password every time.",
  },
  {
    icon: FiArchive,
    title: "History is kept, not deleted",
    body: "An expense type a record uses cannot be deleted — deactivate it and it stops appearing in new records. Its total cannot be changed either.",
  },
  {
    icon: FiFlag,
    title: "A plan ends once",
    body: "Active, then completed, then withdrawn. A completed plan can reopen while money is still owed to it, but a withdrawn one is finished.",
  },
  {
    icon: FiImage,
    title: "Pictures have a ceiling",
    body: "Three profile photos of up to 3MB — delete one to make room for a fourth. A target's picture goes up to 2MB.",
  },
];

export default function HouseRules() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Good to know"
        title="What it will not let you do"
        description="The rules that keep the figures honest. None of them can be argued with from the other side of the screen, so they are worth reading once."
      />

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {RULES.map((rule, index) => {
          const Icon = rule.icon;

          return (
            <div
              key={rule.title}
              className="reveal flex gap-3.5"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-line bg-amber-soft text-amber-fg">
                <Icon size={14} strokeWidth={2.4} />
              </span>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-ink">{rule.title}</h3>

                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {rule.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
