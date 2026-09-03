"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";

import { getExpenseType } from "@/services/expenseTypes.service";

// Seed data writes `value` while the API schema validates `amount`, so read
// both rather than rendering NaN for older rows.
const categoryAmount = (category) =>
  Number(category?.amount ?? category?.value ?? 0);

export default function ExpenseTypeDetailsModal({
  open,
  onClose,
  expenseType,
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const id = expenseType?.id;

  // Refetch on every open: categories can be edited elsewhere, and the
  // dashboard payload only carries name/frequency/totalAmount.
  useEffect(() => {
    if (!open || !id) return;

    let cancelled = false;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setDetails(null);

        const response = await getExpenseType(id);

        if (!cancelled) {
          setDetails(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error.response?.data?.message ||
              "Failed to load expense type",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [open, id]);

  const categories = Array.isArray(details?.categories)
    ? details.categories
    : [];

  const perUse = Number(details?.total ?? 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={expenseType?.name || "Expense Type"}
    >
      {loading ? (
        <div className="flex items-center justify-center py-10 text-ink-muted">
          <Spinner size={26} />
        </div>
      ) : !details ? (
        <p className="py-8 text-center text-sm text-ink-faint">
          Unable to load this expense type.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Stat
              label="Per use"
              value={perUse.toFixed(2)}
            />

            <Stat
              label="Used"
              value={`${expenseType?.frequency ?? 0}x`}
            />

            <Stat
              label="Total"
              value={Number(
                expenseType?.totalAmount ?? 0,
              ).toFixed(2)}
            />
          </div>

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
              Categories
            </p>

            {categories.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line bg-inset px-3 py-6 text-center text-xs text-ink-faint">
                No categories on this type.
              </p>
            ) : (
              <ul className="divide-y divide-line-soft overflow-hidden rounded-xl border border-line-soft bg-inset">
                {categories.map((category, index) => (
                  <li
                    key={`${category.name}-${index}`}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5"
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

                <li className="flex items-center justify-between gap-3 bg-surface px-3.5 py-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                    Per use total
                  </span>

                  <span className="num shrink-0 text-sm font-bold text-amber-fg">
                    {perUse.toFixed(2)}
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-line-soft bg-inset px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">
        {label}
      </p>

      <p className="num mt-1 text-base font-bold text-ink">
        {value}
      </p>
    </div>
  );
}
