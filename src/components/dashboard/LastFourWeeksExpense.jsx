"use client";

import { useState } from "react";

import Section from "./Section";
import Modal from "@/components/common/Modal";

const WEEK_LABELS = {
  week1: "1 Week Ago",
  week2: "2 Weeks Ago",
  week3: "3 Weeks Ago",
  week4: "4 Weeks Ago",
};

export default function LastFourWeeksExpense({
  lastFourWeeks = {},
}) {
  const [activeWeek, setActiveWeek] = useState(null);

  const activeItems = activeWeek
    ? lastFourWeeks[activeWeek] || []
    : [];

  const activeTotal = activeItems.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  return (
    <Section title="Last Four Weekly Expense">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(WEEK_LABELS).map(
          ([weekKey, label]) => {
            const items =
              lastFourWeeks[weekKey] || [];

            const total = items.reduce(
              (sum, item) =>
                sum + Number(item.total || 0),
              0
            );

            return (
              <button
                key={weekKey}
                type="button"
                onClick={() => setActiveWeek(weekKey)}
                className="rounded-lg border border-gray-200 p-3 text-left text-sm transition hover:border-gray-300 hover:bg-gray-50"
              >
                <p className="font-medium text-gray-800">
                  {label}
                </p>

                <p className="text-xs text-gray-500">
                  {items.length} records
                </p>

                <p className="text-xs text-gray-500">
                  {total.toFixed(2)}
                </p>
              </button>
            );
          }
        )}
      </div>

      <Modal
        open={activeWeek !== null}
        onClose={() => setActiveWeek(null)}
        title={
          activeWeek ? WEEK_LABELS[activeWeek] : ""
        }
      >
        {activeItems.length === 0 ? (
          <p className="text-sm text-gray-400">
            No expenses recorded this week.
          </p>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <span className="w-24 shrink-0 text-gray-500">
                  {formatDate(item.date)}
                </span>

                <span className="flex-1 truncate text-gray-700">
                  {item.typeName}
                </span>

                <span className="shrink-0 font-medium text-gray-900">
                  {Number(item.total).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-3 text-xs text-gray-400">
          {activeItems.length} records
          {" · "}
          total {activeTotal.toFixed(2)}
        </p>
      </Modal>
    </Section>
  );
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  const weekday = parsed.toLocaleDateString("en-GB", {
    weekday: "short",
  });

  const dayMonth = parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  return `${weekday}, ${dayMonth}`;
}