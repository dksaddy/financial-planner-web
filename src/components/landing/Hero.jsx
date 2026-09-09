import Link from "next/link";
import { FiArrowRight, FiZap } from "react-icons/fi";

import BudgetPreview from "@/components/landing/BudgetPreview";

export default function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="reveal lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-line bg-indigo-soft px-3.5 py-1.5 text-[13.2px] font-bold uppercase tracking-[0.16em] text-indigo-fg">
            <FiZap size={12} strokeWidth={2.6} />
            Your money, on autopilot
          </span>

          <h1 className="mt-6 text-4xl font-bold uppercase leading-[1.08] tracking-[0.02em] text-ink sm:text-5xl lg:text-[67.2px]">
            Plan the month.
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Spend the day.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted">
            Set your salary once. Financial Planner carves out your savings,
            splits what is left into a daily budget, and banks whatever you do
            not spend toward the things you actually want.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 hover:shadow-indigo-500/50 active:scale-[0.98]"
            >
              Create Free Account
              <FiArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/login"
              className="flex items-center justify-center rounded-xl border border-line bg-surface px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink"
            >
              I already have one
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line-soft pt-6">
            {[
              { value: "26", label: "Working days budgeted" },
              { value: "6", label: "Spending days a week" },
              { value: "1", label: "Dashboard for all of it" },
            ].map((stat) => (
              <div key={stat.label}>
                <dd className="num text-2xl font-bold text-ink">
                  {stat.value}
                </dd>

                <dt className="mt-1 text-[13.2px] uppercase leading-tight tracking-wider text-ink-faint">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="reveal lg:col-span-6"
          style={{ animationDelay: "140ms" }}
        >
          <BudgetPreview />
        </div>
      </div>
    </section>
  );
}
