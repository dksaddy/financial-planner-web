"use client";

import { useEffect, useState } from "react";
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

import { logout as logoutApi } from "@/services/auth.service";
import { getDashboard } from "@/services/dashboard.service";
import { isAuthenticated, getUser, logout as clearAuth } from "@/lib/auth";

// Cards fade up in reading order rather than all at once.
const stagger = (index) => ({ animationDelay: `${index * 70}ms` });

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    setUser(getUser());

    fetchDashboard();
  }, [router]);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();
      setDashboard(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      // Clear local authentication even if API logout fails.
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

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
        <DashboardHeader user={user} onLogout={handleLogout} />
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
            <TargetCard
              targets={targets}
              extraSaving={extraSaving}
              onAdded={fetchDashboard}
            />
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
          <Savings plans={saving.plans} onAdded={fetchDashboard} />
        </div>
      </div>
    </main>
  );
}