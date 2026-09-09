import Link from "next/link";

import LandingNav from "@/components/landing/LandingNav";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import CallToAction from "@/components/landing/CallToAction";

export const metadata = {
  title: "Financial Planner — plan the month, spend the day",
  description:
    "Turn one salary figure into a daily budget: saving plans, reusable expense types, logged spending, targets funded by whatever you do not spend.",
};

export default function LandingPage() {
  return (
    <>
      <LandingNav />

      <main className="flex-1">
        <Hero />

        <Features />

        <HowItWorks />

        <Benefits />

        <CallToAction />
      </main>

      <footer className="border-t border-line-soft">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-ink-faint sm:flex-row sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.16em]">Financial Planner</p>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="uppercase tracking-wider transition hover:text-ink"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="uppercase tracking-wider transition hover:text-ink"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
