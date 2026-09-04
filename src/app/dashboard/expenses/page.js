"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiActivity,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import Section from "@/components/dashboard/Section";
import AddExpenseModal from "@/components/dashboard/AddExpenseModal";
import EditExpenseModal from "@/components/dashboard/EditExpenseModal";
import DeleteExpenseDialog from "@/components/dashboard/DeleteExpenseDialog";
import Spinner from "@/components/common/Spinner";

import { getExpenseRecords } from "@/services/expenseRecords.service";
import { isAuthenticated } from "@/lib/auth";

export default function AllExpensesPage() {
  const router = useRouter();

  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    fetchRecords();
  }, [router]);

  const fetchRecords = async () => {
    try {
      const response = await getExpenseRecords();
      setRecords(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load expenses"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner size={32} />

        <p className="text-sm text-ink-faint">Loading expenses…</p>
      </main>
    );
  }

  const items = records || [];
  const totalSpent = items.reduce(
    (sum, item) => sum + (Number(item.total) || 0),
    0
  );

  // Group into date buckets while keeping the API's date-desc order.
  const groups = [];
  const groupIndex = new Map();

  items.forEach((item) => {
    const key = String(item.date).slice(0, 10);

    if (!groupIndex.has(key)) {
      groupIndex.set(key, groups.length);
      groups.push({ date: key, items: [] });
    }

    groups[groupIndex.get(key)].items.push(item);
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="reveal mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            href="/dashboard"
            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink"
            aria-label="Back to dashboard"
          >
            <FiArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          </Link>

          <div>
            <h1 className="text-[26px] font-bold uppercase leading-tight tracking-[0.06em] text-ink">
              All Expenses
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-dot" />
              {items.length} records · {totalSpent.toFixed(2)} total
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 px-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50 hover:brightness-110 active:scale-95"
        >
          <FiPlus size={16} strokeWidth={2.6} />
          Add Expense
        </button>
      </div>

      <AddExpenseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchRecords}
      />

      <EditExpenseModal
        open={Boolean(editRecord)}
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onSuccess={fetchRecords}
      />

      <DeleteExpenseDialog
        open={Boolean(deleteRecord)}
        record={deleteRecord}
        onClose={() => setDeleteRecord(null)}
        onSuccess={fetchRecords}
      />

      <div className="reveal" style={{ animationDelay: "70ms" }}>
        <Section title="Expense Records" icon={FiActivity} accent="indigo">
          {groups.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-faint">
              No expenses recorded yet.
            </p>
          ) : (
            <div className="space-y-5">
              {groups.map((group) => {
                const dayTotal = group.items.reduce(
                  (sum, item) => sum + (Number(item.total) || 0),
                  0
                );

                return (
                  <div key={group.date}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                        {formatDate(group.date)}
                      </span>

                      <span className="num text-xs font-bold text-ink-muted">
                        {dayTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.items.map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-inset px-3.5 py-2.5 text-sm transition hover:border-indigo-line hover:bg-indigo-soft"
                        >
                          <span className="min-w-0 flex-1 truncate font-medium text-ink">
                            {record.expense_type_name}
                          </span>

                          <div className="flex shrink-0 items-center gap-2.5">
                            <span className="num text-base font-bold text-ink">
                              {Number(record.total).toFixed(2)}
                            </span>

                            <button
                              type="button"
                              onClick={() => setEditRecord(record)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition hover:bg-surface-hover hover:text-ink"
                              aria-label={`Edit ${record.expense_type_name}`}
                            >
                              <FiEdit2 size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteRecord(record)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition hover:bg-rose-soft hover:text-rose-fg"
                              aria-label={`Delete ${record.expense_type_name}`}
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}