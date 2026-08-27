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
              <span className="text-gray-500">
                {formatDate(record.date)}
              </span>

              <span className="flex-1 truncate text-gray-700">
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
        {currentWeek.totalRecords} records
        {" · "}
        total {Number(currentWeek.totalExpense).toFixed(2)}
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

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}