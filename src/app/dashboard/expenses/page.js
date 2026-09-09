"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import MonthTabs from "@/components/dashboard/MonthTabs";
import AddExpenseModal from "@/components/dashboard/AddExpenseModal";
import EditExpenseModal from "@/components/dashboard/EditExpenseModal";
import DeleteExpenseDialog from "@/components/dashboard/DeleteExpenseDialog";
import Spinner from "@/components/common/Spinner";
import Pagination from "@/components/common/Pagination";

import { getExpenseRecords } from "@/services/expenseRecords.service";
import { isAuthenticated } from "@/lib/auth";

const PAGE_SIZE = 10;

export default function AllExpensesPage() {
  const router = useRouter();

  const [records, setRecords] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [activeMonth, setActiveMonth] = useState("all");
  const [page, setPage] = useState(1);

  // Bumped every time a fresh batch of records lands. Used as a `key` on
  // the list wrapper so the row entrance animation replays on every page
  // change, month switch, and add/edit/delete — not just first mount.
  const [renderKey, setRenderKey] = useState(0);

  // Page and month changes each fire a request, and the answers can come
  // back out of order. Only the newest request is allowed to write state.
  const requestId = useRef(0);

  const fetchRecords = useCallback(
    async (nextPage = page, nextMonth = activeMonth) => {
      const id = requestId.current + 1;
      requestId.current = id;

      try {
        setFetching(true);

        const response = await getExpenseRecords({
          page: nextPage,
          limit: PAGE_SIZE,
          month: nextMonth,
        });

        if (requestId.current !== id) return;

        setRecords(response.data || []);
        setMeta(response.meta || null);
        setRenderKey((k) => k + 1);

        // The API clamps a page past the end (after deleting the last
        // record on the last page, say); follow it back.
        const serverPage = response.meta?.pagination?.page;

        if (serverPage && serverPage !== nextPage) {
          setPage(serverPage);
        }
      } catch (error) {
        if (requestId.current !== id) return;

        toast.error(
          error.response?.data?.message || "Failed to load expenses"
        );
      } finally {
        if (requestId.current === id) {
          setFetching(false);
          setLoading(false);
        }
      }
    },
    [page, activeMonth]
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    fetchRecords(page, activeMonth);
    // Refetch whenever the page or the month filter changes.
  }, [router, page, activeMonth]);

  // The selected month can disappear underneath us — deleting its last
  // record drops it from `meta.months`. Fall back to "All", which
  // refetches through the effect above.
  useEffect(() => {
    const knownMonths = meta?.months;

    if (!knownMonths || activeMonth === "all") return;

    if (!knownMonths.includes(activeMonth)) {
      setActiveMonth("all");
      setPage(1);
    }
  }, [meta, activeMonth]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner size={32} />

        <p className="text-sm text-ink-faint">Loading expenses…</p>
      </main>
    );
  }

  // This page holds one page of records; everything describing the full
  // set — the month tabs, the record count, the total spent — comes from
  // the response's `meta`, because it cannot be derived from ten rows.
  const pageItems = records || [];

  const monthKeys = meta?.months || [];

  const months = [
    { key: "all", label: "All" },
    ...monthKeys.map((key) => ({ key, label: formatMonthLabel(key) })),
  ];

  // If the active month has no records left (e.g. after deleting the last
  // one), fall back to "All" rather than showing a tab that is now gone.
  const selectedMonth =
    activeMonth === "all" || monthKeys.includes(activeMonth)
      ? activeMonth
      : "all";

  const pagination = meta?.pagination;

  const totalRecords = pagination?.total ?? pageItems.length;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? page;

  const totalSpent = Number(meta?.summary?.total_amount ?? 0);

  const pageStart = (currentPage - 1) * PAGE_SIZE;

  const changeMonth = (month) => {
    setActiveMonth(month);
    setPage(1);
  };

  const changePage = (next) => {
    setPage(Math.min(Math.max(next, 1), totalPages));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Refetch the page currently on screen — used after add/edit/delete.
  const refresh = () => fetchRecords(page, activeMonth);

  // Group into date buckets while keeping the API's date-desc order. The
  // API paginates records, not days, so a busy day can straddle two pages
  // and its header then totals only the part shown here.
  const groups = [];
  const groupIndex = new Map();

  pageItems.forEach((item) => {
    const key = String(item.date).slice(0, 10);

    if (!groupIndex.has(key)) {
      groupIndex.set(key, groups.length);
      groups.push({ date: key, items: [] });
    }

    groups[groupIndex.get(key)].items.push(item);
  });

  // Running row counter across all groups, used to keep the cascade delay
  // increasing smoothly from the top of the list to the bottom rather than
  // restarting at each date header.
  let rowCursor = 0;

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
            <h1 className="text-[22px] font-bold uppercase leading-tight sm:text-[31.2px] tracking-[0.06em] text-ink">
              All Expenses
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-dot" />
              {totalRecords} records · {totalSpent.toFixed(2)} total
              {totalRecords > PAGE_SIZE &&
                ` · showing ${pageStart + 1}–${pageStart + pageItems.length}`}
            </p>
          </div>
        </div>

      </div>

      <AddExpenseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={refresh}
      />

      <EditExpenseModal
        open={Boolean(editRecord)}
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onSuccess={refresh}
      />

      <DeleteExpenseDialog
        open={Boolean(deleteRecord)}
        record={deleteRecord}
        onClose={() => setDeleteRecord(null)}
        onSuccess={refresh}
      />

      <div className="reveal" style={{ animationDelay: "70ms" }}>
        <Section
          title="Expense Records"
          icon={FiActivity}
          accent="indigo"
          actions={
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 px-3.5 text-[13.2px] font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-500/50 hover:brightness-110 active:scale-95"
            >
              <FiPlus size={14} strokeWidth={2.6} />
              Add Expense
            </button>
          }
        >
          <MonthTabs
            months={months}
            active={selectedMonth}
            onChange={changeMonth}
          />

          {/* Keep the current page visible but muted while the next one
              loads, so the layout does not collapse between pages. */}
          <div
            className={`transition-all duration-300 ease-out ${
              fetching ? "pointer-events-none opacity-40" : "opacity-100"
            }`}
          >
          {groups.length === 0 ? (
            <p className="fade-in py-6 text-center text-sm text-ink-faint">
              {selectedMonth === "all"
                ? "No expenses recorded yet."
                : "No expenses recorded for this month."}
            </p>
          ) : (
            <div key={renderKey} className="space-y-5">
              {groups.map((group, gIndex) => {
                const dayTotal = group.items.reduce(
                  (sum, item) => sum + (Number(item.total) || 0),
                  0
                );

                return (
                  <div
                    key={group.date}
                    className="reveal"
                    style={{
                      animationDelay: `${Math.min(gIndex * 55, 300)}ms`,
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                        {formatDate(group.date)}
                      </span>

                      <span className="num text-xs font-bold text-ink-muted">
                        {dayTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.items.map((record) => {
                        // Capture this row's position across the whole
                        // list (not just within its group) before
                        // incrementing, so the cascade reads top-to-bottom.
                        const rowDelay = Math.min(rowCursor * 35, 380);
                        rowCursor += 1;

                        return (
                          <div
                            key={record.id}
                            className="reveal flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-inset px-3.5 py-2.5 text-sm transition hover:border-indigo-line hover:bg-indigo-soft hover:shadow-md hover:shadow-indigo-500/10"
                            style={{ animationDelay: `${rowDelay}ms` }}
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
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={changePage}
          />
        </Section>
      </div>
    </main>
  );
}

function formatMonthLabel(key) {
  // key is "YYYY-MM". Build the Date with the local-time constructor
  // (no UTC round trip) — same reasoning as formatDate below.
  const match = /^(\d{4})-(\d{2})$/.exec(key);

  if (!match) {
    return key;
  }

  const [, year, month] = match;
  const parsed = new Date(Number(year), Number(month) - 1, 1);

  return parsed.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

function formatDate(date) {
  if (!date) return "—";

  // `date` is a plain "YYYY-MM-DD" calendar date with no time-of-day
  // or timezone component. `new Date("YYYY-MM-DD")` parses it as UTC
  // midnight, and toLocaleDateString() then renders it in the
  // browser's LOCAL timezone — a round trip that can silently shift
  // the displayed day depending on where the browser is. Parsing the
  // parts by hand and building the Date with the local-time
  // constructor avoids any timezone conversion entirely.
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(date));

  if (!match) {
    return date;
  }

  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));

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