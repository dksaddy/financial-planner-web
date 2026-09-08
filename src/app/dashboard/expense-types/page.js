"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiArrowLeft, FiRepeat, FiChevronDown, FiPlus } from "react-icons/fi";

import Section from "@/components/dashboard/Section";
import Spinner from "@/components/common/Spinner";
import AddExpenseTypeModal from "@/components/dashboard/AddExpenseTypeModal";

import { getExpenseTypes } from "@/services/expenseTypes.service";
import { isAuthenticated } from "@/lib/auth";

// Seed data writes `value` while the API schema validates `amount`, so
// read both rather than rendering NaN for older rows.
const categoryAmount = (category) =>
  Number(category?.amount ?? category?.value ?? 0);

export default function AllExpenseTypesPage() {
  const router = useRouter();

  const [types, setTypes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    fetchTypes();
  }, [router]);

  const fetchTypes = async () => {
    try {
      const response = await getExpenseTypes();
      setTypes(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load expense types"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner size={32} />

        <p className="text-sm text-ink-faint">Loading expense types…</p>
      </main>
    );
  }

  const items = types || [];

  const grandTotal = items.reduce(
    (sum, item) => sum + (Number(item.total) || 0),
    0
  );

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
              All Expense Types
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-dot" />
              {items.length} types · {grandTotal.toFixed(2)} total
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 px-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-amber-500/30 transition hover:shadow-amber-500/50 hover:brightness-110 active:scale-95"
        >
          <FiPlus size={16} strokeWidth={2.6} />
          Add Type
        </button>
      </div>

      <AddExpenseTypeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchTypes}
      />

      <div className="reveal" style={{ animationDelay: "70ms" }}>
        <Section title="Expense Types" icon={FiRepeat} accent="amber">
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-faint">
              No expense types yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 items-start gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((type) => {
                const categories = Array.isArray(type.categories)
                  ? type.categories
                  : [];
                const isOpen = expandedId === type.id;

                return (
                  <div
                    key={type.id}
                    className="overflow-hidden rounded-xl border border-line-soft bg-inset transition hover:-translate-y-0.5 hover:border-amber-line hover:bg-amber-soft"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isOpen ? null : type.id)
                      }
                      className="flex w-full flex-col items-start gap-2.5 p-4 text-left"
                      aria-expanded={isOpen}
                      aria-label={`Toggle ${type.name} categories`}
                    >
                      <div className="flex w-full items-start justify-between gap-2">
                        <p className="min-w-0 flex-1 truncate text-sm font-bold text-ink">
                          {type.name}
                        </p>

                        <FiChevronDown
                          size={15}
                          className={`mt-0.5 shrink-0 text-ink-faint transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      <p className="num text-lg font-bold text-amber-fg">
                        {Number(type.total).toFixed(2)}
                      </p>

                      <p className="text-[11px] text-ink-faint">
                        {categories.length} categor
                        {categories.length === 1 ? "y" : "ies"}
                      </p>
                    </button>

                    {isOpen && (
                      <div className="border-t border-line-soft bg-surface px-4 py-3">
                        {categories.length === 0 ? (
                          <p className="py-2 text-center text-xs text-ink-faint">
                            No categories on this type.
                          </p>
                        ) : (
                          <ul className="divide-y divide-line-soft">
                            {categories.map((category, index) => (
                              <li
                                key={`${category.name}-${index}`}
                                className="flex items-center justify-between gap-3 py-2"
                              >
                                <span className="flex min-w-0 items-center gap-2">
                                  <span
                                    aria-hidden
                                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-dot"
                                  />

                                  <span className="truncate text-sm text-ink">
                                    {category.name}
                                  </span>
                                </span>

                                <span className="num shrink-0 text-sm font-bold text-ink-muted">
                                  {categoryAmount(category).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
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