import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function CallToAction() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <div className="reveal relative overflow-hidden rounded-2xl border border-line bg-panel px-6 py-12 text-center shadow-panel sm:px-12">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 opacity-[0.16] blur-3xl"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-400 to-emerald-500 opacity-[0.14] blur-3xl"
        />

        <h2 className="relative text-3xl font-bold uppercase tracking-[0.03em] text-ink sm:text-4xl">
          Start with this month
        </h2>

        <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
          One salary figure and a saving plan is enough to get a daily budget on
          screen. Everything else can wait until you need it.
        </p>

        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 hover:shadow-indigo-500/50 active:scale-[0.98]"
          >
            Create Account
            <FiArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center rounded-xl border border-line bg-surface px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
