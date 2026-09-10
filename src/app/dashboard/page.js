"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SavingSummary from "@/components/dashboard/SavingSummary";
import SpendingCard from "@/components/dashboard/SpendingCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import SavingBreakdown from "@/components/dashboard/SavingBreakdown";
import TargetCard from "@/components/dashboard/TargetCard";
import ExtraSavingCard from "@/components/dashboard/ExtraSavingCard";
import SavingPlanOverview from "@/components/dashboard/SavingPlanOverview";
import FrequentExpense from "@/components/dashboard/FrequentExpense";
import RunningWeeklyExpense from "@/components/dashboard/RunningWeeklyExpense";
import LastFourWeeksExpense from "@/components/dashboard/LastFourWeeksExpense";
import Savings from "@/components/dashboard/Savings";
import Spinner from "@/components/common/Spinner";

import { getDashboard } from "@/services/dashboard.service";
import { getProfile } from "@/services/user.service";
import { isAuthenticated, getUser, setUser as cacheUser } from "@/lib/auth";

// Cards fade up in reading order rather than all at once.
const stagger = (index) => ({ animationDelay: `${index * 70}ms` });

export default function DashboardPage() {
  const router = useRouter();

  // Seeded straight from the cookie copy rather than written in on mount, so
  // the header has a name and photo on its first paint instead of rendering
  // empty and then re-rendering. The effect below still reconciles it with the
  // server — a cookie written by an older login can be missing fields the
  // header renders, and the name or photo may have changed elsewhere. Reading
  // a cookie during prerender yields null, which is fine: this page renders
  // the spinner until `loading` clears, so the markup matches either way.
  const [user, setUser] = useState(getUser);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetches and reports failures, but never touches state — that is left to
  // the caller. Keeping the commit out of here is what lets the mount effect
  // below cancel a response it no longer wants.
  const loadDashboard = useCallback(async () => {
    try {
      const response = await getDashboard();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
      return null;
    }
  }, []);

  // Passed down as `onSuccess` / `onAdded` / `onDeposit`, and awaitable so a
  // caller can hold its own pending state open until the refresh has landed.
  const fetchDashboard = useCallback(async () => {
    const data = await loadDashboard();

    if (data) setDashboard(data);
  }, [loadDashboard]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    let active = true;

    getProfile()
      .then((response) => {
        if (!active) return;

        setUser(response.data);
        cacheUser(response.data);
      })
      .catch(() => {
        // The cached user is enough to render the header; a genuinely dead
        // session is caught by the dashboard request's own error handling.
      });

    loadDashboard().then((data) => {
      if (!active) return;

      if (data) setDashboard(data);
      setLoading(false);
    });

    // Drops responses that arrive after this effect has been superseded.
    return () => {
      active = false;
    };
  }, [router, loadDashboard]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner size={32} />

        <p className="text-sm text-ink-faint">Loading your dashboard…</p>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-2xl border border-line bg-surface px-8 py-10 text-center">
          <p className="text-ink-muted">Unable to load dashboard.</p>
        </div>
      </main>
    );
  }

  const { saving, spending, extraSaving, targets, expenses } = dashboard;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="reveal">
        <DashboardHeader user={user} />
      </div>

      <div className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="reveal lg:col-span-5" style={stagger(1)}>
            <SavingSummary saving={saving} />
          </div>

          <div className="reveal lg:col-span-7" style={stagger(2)}>
            <SavingPlanOverview
              plans={saving.plans}
              onDeposit={fetchDashboard}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="reveal lg:col-span-3" style={stagger(3)}>
            <SpendingCard spending={spending} />
          </div>

          <div className="reveal lg:col-span-6" style={stagger(4)}>
            <ProgressCard
              saving={saving}
              spending={spending}
              targets={targets}
            />
          </div>

          <div className="reveal lg:col-span-3" style={stagger(5)}>
            <SavingBreakdown saving={saving} />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="reveal lg:col-span-2" style={stagger(6)}>
            <TargetCard targets={targets} extraSaving={extraSaving} />
          </div>

          <div className="reveal" style={stagger(7)}>
            <ExtraSavingCard extraSaving={extraSaving} targets={targets} />
          </div>
        </div>

        {/* Row 4 */}
        <div className="reveal" style={stagger(8)}>
          <FrequentExpense expenses={expenses.topExpenseTypes} />
        </div>

        {/* Row 5 */}
        <div className="reveal" style={stagger(9)}>
          <RunningWeeklyExpense
            currentWeek={expenses.currentWeek}
            onExpenseAdded={fetchDashboard}
          />
        </div>

        {/* Row 6 */}
        <div className="reveal" style={stagger(10)}>
          <LastFourWeeksExpense
            lastFourWeeks={expenses.lastFourWeeks}
            weeklyBudget={spending.weekly}
            dailyBudget={spending.daily}
          />
        </div>

        {/* Row 7 */}
        <div className="reveal" style={stagger(11)}>
          <Savings plans={saving.plans} />
        </div>
      </div>
    </main>
  );
}