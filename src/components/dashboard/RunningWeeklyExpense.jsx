"use client";

import { useState } from "react";

import Section from "./Section";
import AddExpenseModal from "./AddExpenseModal";

export default function RunningWeeklyExpense({
  currentWeek,
  onExpenseAdded,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const records = currentWeek?.records || [];

  return (
    <Section
      title="Running Weekly Expense"
      actions={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
        >
          + Add
        </button>
      }
    >
      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onExpenseAdded}
      />

      {records.length === 0 ? (
        <p className="text-sm text-gray-400">
          No expenses recorded this week.
        </p>
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <span className="w-24 shrink-0 text-gray-500">
                {formatDate(record.date)}
              </span>

              <span className="flex-1 truncate text-gray-700">
                {record.expense_type_name}
              </span>

              <span className="w-20 shrink-0 text-right text-xs text-gray-400">
                {record.extraSave === null
                  ? "—"
                  : `saved ${Number(record.extraSave).toFixed(2)}`}
              </span>

              <span className="w-20 shrink-0 text-right font-medium text-gray-900">
                {Number(record.total).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-gray-400">
        {currentWeek.totalRecords} records
        {" · "}
        total {Number(currentWeek.totalExpense).toFixed(2)}
        {" · "}
        saved {Number(currentWeek.totalExtraSave).toFixed(2)}
      </p>
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