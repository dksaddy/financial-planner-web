"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileCard from "@/components/dashboard/ProfileCard";
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
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <Spinner />
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Unable to load dashboard.</p>
      </main>
    );
  }

  const { saving, spending, extraSaving, targets, expenses } = dashboard;

  return (
    <main className="min-h-screen bg-gray-100 p-5">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ProfileCard user={user} />

          <SavingSummary saving={saving} />

          <SavingPlanOverview plans={saving.plans} onDeposit={fetchDashboard} />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SpendingCard spending={spending} />

          <ProgressCard saving={saving} spending={spending} targets={targets} />

          <SavingBreakdown saving={saving} />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TargetCard targets={targets} className="md:col-span-2" />

          <ExtraSavingCard extraSaving={extraSaving} />
        </div>

        {/* Row 4 */}
        <FrequentExpense expenses={expenses.topExpenseTypes} />

        {/* Row 5 */}
        <RunningWeeklyExpense
          currentWeek={expenses.currentWeek}
          onExpenseAdded={fetchDashboard}
        />

        {/* Row 6 */}
        <LastFourWeeksExpense lastFourWeeks={expenses.lastFourWeeks} />

        {/* Row 7 */}
        <Savings />
      </div>
    </main>
  );
}
