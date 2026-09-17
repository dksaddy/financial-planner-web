import SectionHeading from "@/components/landing/SectionHeading";

const STEPS = [
  {
    number: "01",
    title: "Set your salary and your days",
    body: "Register, open your profile and enter what lands each month, then the days you actually spend on — 26 a month and 6 a week to begin with. The daily figure is what is left after savings, divided by those days.",
  },
  {
    number: "02",
    title: "Carve out savings",
    body: "Add a weekly plan, a monthly plan, or both. What they hold is set aside first, and each plan taxes its own profit at its own rate — 15% until you change it.",
  },
  {
    number: "03",
    title: "Describe your spending",
    body: "Create expense types with their categories once. They are the templates every record is logged against, and a type's total is fixed at creation so old records never shift under you.",
  },
  {
    number: "04",
    title: "Log as you go",
    body: "One record a day, and a week holds as many as your working days — never a day ahead of today. The dashboard recalculates the day, the week and the last four weeks the moment you save.",
  },
  {
    number: "05",
    title: "Deposit as you save",
    body: "Pay into a plan whenever the money is there; your password confirms every move. The plan completes itself when the last deposit fills it, and withdrawing it is the final step.",
  },
  {
    number: "06",
    title: "Point the surplus somewhere",
    body: "Create a target for what you are working toward. Whatever you did not spend accumulates against it until it is paid off.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <SectionHeading
        eyebrow="How to use it"
        title="Six steps, then it runs itself"
        description="The setup takes one sitting. After that the only recurring job is logging what you spend."
      />

      <ol className="relative mt-12 space-y-3">
        {/* Spine the numbers hang off, on wide screens only. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-[27px] top-4 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-indigo-line via-violet-line to-transparent sm:block"
        />

        {STEPS.map((step, index) => (
          <li
            key={step.number}
            className="reveal relative flex gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:border-line-strong hover:bg-surface-hover sm:gap-6 sm:p-6"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="num relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-line bg-panel text-sm font-bold text-indigo-fg">
              {step.number}
            </span>

            <div className="min-w-0">
              <h3 className="text-[17.1px] font-bold uppercase tracking-[0.12em] text-ink">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
