"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Section from "./Section";
import Spinner from "@/components/common/Spinner";

import { getSavingPlans } from "@/services/savingPlans.service";

export default function RunningSavings() {
  const [savingPlans, setSavingPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavingPlans = async () => {
      try {
        setLoading(true);

        const response = await getSavingPlans();

        setSavingPlans(response.data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load saving plans"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSavingPlans();
  }, []);

  return (
    <Section title=" Active Savings">
      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : savingPlans.length === 0 ? (
        <p className="text-sm text-gray-400">
          No saving plans yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {savingPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg border border-gray-200 p-3 text-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-gray-800">
                  {plan.name}
                </p>

                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles(
                    plan.status
                  )}`}
                >
                  {plan.status}
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Amount
              </p>
              <p className="font-medium text-gray-800">
                {Number(plan.amount).toFixed(2)}
                {" "}
                <span className="text-xs font-normal text-gray-400">
                  / {frequencyLabel(plan.frequency)}
                </span>
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Duration
              </p>
              <p className="font-medium text-gray-800">
                {plan.months} month
                {Number(plan.months) === 1 ? "" : "s"}
              </p>

              <div className="mt-2 grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-gray-500">
                    Deposit
                  </p>
                  <p className="font-medium text-gray-800">
                    {Number(plan.deposit_amount).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Withdrawal
                  </p>
                  <p className="font-medium text-gray-800">
                    {Number(plan.withdrawal_amount).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Profit
                  </p>
                  <p className="font-medium text-gray-800">
                    {Number(plan.withdrawal_amount - plan.deposit_amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function frequencyLabel(frequency) {
  const days = Number(frequency);

  if (days === 7) return "week";
  if (days === 30) return "month";

  return `${days} days`;
}

function statusStyles(status) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}