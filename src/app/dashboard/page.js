"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Section from "@/components/dashboard/Section";
import NotAvailable from "@/components/dashboard/NotAvailable";
import Spinner from "@/components/common/Spinner";

import { logout as logoutApi } from "@/services/auth.service";
import { getDashboard } from "@/services/dashboard.service";
import { isAuthenticated, getUser, logout as clearAuth } from "@/lib/auth";

const WEEK_LABELS = {
  week1: "1 Week Ago",
  week2: "2 Weeks Ago",
  week3: "3 Weeks Ago",
  week4: "4 Weeks Ago",
};

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

    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        setDashboard(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      // Even if the server call fails (e.g. network issue, token
      // already expired), we still want to clear local state and
      // send the user to login rather than leaving them stuck.
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

  const { saving, spending, targets, expenses } = dashboard;

  const topExpenseSlots = [
    ...expenses.topExpenseTypes,
    ...Array(Math.max(0, 4 - expenses.topExpenseTypes.length)).fill(null),
  ].slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-100 p-5">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          {user?.name && (
            <p className="text-sm text-gray-500">Welcome, {user.name}</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-200"
        >
          Logout
        </button>
      </div>

      <div className="space-y-5">
        {/* Row 1: Profile / Saving Summary / Empty */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Section title="Profile">
            <NotAvailable />
          </Section>

          <Section title="Saving Summary">
            <div className="space-y-2 text-sm">
              <Row label="Total Deposit" value={saving.totalDeposit} />
              <Row label="Total Withdrawal" value={saving.totalWithdrawal} />
              <Row label="Profit" value={saving.profit} />
            </div>
          </Section>

          <Section title="Overview">
            <NotAvailable />
          </Section>
        </div>

        {/* Row 2: Spending / Progress circles / Saving breakdown */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Section title="Spending">
            <div className="space-y-2 text-sm">
              <Row label="Monthly" value={spending.monthly} />
              <Row label="Weekly" value={spending.weekly} />
              <Row label="Daily" value={spending.daily} />
            </div>
          </Section>

          <Section title="Progress">
            <div className="flex h-full gap-3">
              <NotAvailable />
              <NotAvailable />
            </div>
          </Section>

          <Section title="Saving Breakdown">
            <div className="space-y-2 text-sm">
              <Row label="Weekly Saving" value={saving.weeklySaving} />
              <Row label="Monthly Saving" value={saving.monthlySaving} />
              <Row
                label="Total Monthly Saving"
                value={saving.totalMonthlySaving}
              />
            </div>
          </Section>
        </div>

        {/* Row 3: Targets / Extra save */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Section title="Target" className="md:col-span-2">
            {targets.pendingTargets.length === 0 ? (
              <p className="text-sm text-gray-400">No pending targets.</p>
            ) : (
              <div className="space-y-3">
                {targets.pendingTargets.map((target) => (
                  <div
                    key={target.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="w-1/2 truncate text-gray-700">
                      {target.name}
                    </span>
                    <span className="w-1/3 text-right font-medium text-gray-900">
                      {Number(target.target_amount).toFixed(2)}
                    </span>
                  </div>
                ))}
                <p className="pt-1 text-xs text-gray-400">
                  {targets.totalPendingTargets} pending &middot; total{" "}
                  {targets.totalTargetAmount.toFixed(2)}
                </p>
              </div>
            )}
          </Section>

          <Section title="Total Extra Save">
            <NotAvailable />
          </Section>
        </div>

        {/* Row 4: Frequently Expense Type */}
        <Section title="Frequently Expense Type">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {topExpenseSlots.map((expense, index) =>
              expense ? (
                <div
                  key={expense.id}
                  className="rounded-lg border border-gray-200 p-3 text-sm"
                >
                  <p className="truncate font-medium text-gray-800">
                    {expense.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {expense.frequency}x
                  </p>
                  <p className="text-xs text-gray-500">
                    {expense.totalAmount.toFixed(2)}
                  </p>
                </div>
              ) : (
                <NotAvailable key={`empty-${index}`} />
              )
            )}
          </div>
        </Section>

        {/* Row 5: Running Weekly Expense */}
        <Section title="Running Weekly Expense">
          {expenses.currentWeek.records.length === 0 ? (
            <p className="text-sm text-gray-400">
              No expenses recorded this week.
            </p>
          ) : (
            <div className="space-y-2">
              {expenses.currentWeek.records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <span className="text-gray-500">{record.date}</span>
                  <span className="text-gray-700">
                    {record.expense_type_name}
                  </span>
                  <span className="font-medium text-gray-900">
                    {Number(record.total).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="mt-3 text-xs text-gray-400">
            {expenses.currentWeek.totalRecords} records &middot; total{" "}
            {expenses.currentWeek.totalExpense.toFixed(2)}
          </p>
        </Section>

        {/* Row 6: Last Four Weekly Expense */}
        <Section title="Last Four Weekly Expense">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.keys(WEEK_LABELS).map((weekKey) => {
              const items = expenses.lastFourWeeks[weekKey] || [];
              const total = items.reduce(
                (sum, item) => sum + item.total,
                0
              );

              return (
                <div
                  key={weekKey}
                  className="rounded-lg border border-gray-200 p-3 text-sm"
                >
                  <p className="font-medium text-gray-800">
                    {WEEK_LABELS[weekKey]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {items.length} records
                  </p>
                  <p className="text-xs text-gray-500">
                    {total.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Row 7: Running Savings */}
        <Section title="Running Savings">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <NotAvailable />
            <NotAvailable />
            <NotAvailable />
            <NotAvailable />
          </div>
        </Section>
      </div>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">
        {Number(value).toFixed(2)}
      </span>
    </div>
  );
}