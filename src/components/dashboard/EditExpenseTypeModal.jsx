"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { updateExpenseTypeSchema } from "@/validations/expenseTypes.validation";
import { updateExpenseType } from "@/services/expenseTypes.service";

const emptyCategory = { name: "", amount: "" };

// Seed data writes `value` while the API schema validates `amount`, so read
// both rather than rendering NaN for older rows.
const categoryAmount = (category) =>
  Number(category?.amount ?? category?.value ?? 0);

const toCents = (amount) => Math.round((Number(amount) || 0) * 100);

export default function EditExpenseTypeModal({
  open,
  onClose,
  expenseType,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateExpenseTypeSchema),
    defaultValues: {
      name: "",
      categories: [emptyCategory],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  // The total is frozen at creation time — expense records copy it — so the
  // original is the target every edit has to hit.
  const originalTotal = Number(expenseType?.total ?? 0);

  useEffect(() => {
    if (!open || !expenseType) return;

    const categories = Array.isArray(expenseType.categories)
      ? expenseType.categories
      : [];

    reset({
      name: expenseType.name ?? "",
      categories: categories.length
        ? categories.map((category) => ({
            name: category.name ?? "",
            amount: categoryAmount(category),
          }))
        : [emptyCategory],
    });
  }, [open, expenseType, reset]);

  // `useWatch` rather than `watch()`: it subscribes through `control` instead
  // of handing back a fresh function on every render, which is what lets React
  // Compiler memoize this component instead of skipping it.
  const categoryValues = useWatch({ control, name: "categories" });

  const total = (categoryValues || []).reduce(
    (sum, category) => sum + (Number(category?.amount) || 0),
    0
  );

  const difference = total - originalTotal;
  const totalMatches = toCents(total) === toCents(originalTotal);

  const onSubmit = async (data) => {
    if (!totalMatches) {
      toast.error(
        `Total must stay at ${originalTotal.toFixed(2)}`
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await updateExpenseType(expenseType.id, {
        name: data.name,
        categories: data.categories.map((category) => ({
          name: category.name,
          amount: Number(category.amount),
        })),
      });

      toast.success(response.message);

      onSuccess?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update expense type"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Expense Type"
      size="lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <p className="rounded-xl border border-line-soft bg-inset px-3.5 py-2.5 text-xs text-ink-muted">
          Past records already use this type&apos;s total, so it cannot
          change. Rename it or move amounts between categories — the total
          must stay at{" "}
          <span className="num font-bold text-ink">
            {originalTotal.toFixed(2)}
          </span>
          .
        </p>

        <Input
          label="Type Name"
          name="name"
          placeholder="e.g. Super Dellux"
          register={register}
          error={errors.name}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Categories
            </label>

            <button
              type="button"
              onClick={() => append(emptyCategory)}
              className="flex items-center gap-1 text-[12.54px] font-bold uppercase tracking-wider text-amber-fg transition hover:brightness-110"
            >
              <FiPlus size={13} strokeWidth={2.6} />
              Add Category
            </button>
          </div>

          {errors.categories?.root && (
            <p className="text-xs text-rose-fg">
              {errors.categories.root.message}
            </p>
          )}

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-start gap-2"
              >
                <div className="flex-1 space-y-1">
                  <input
                    placeholder="Category name"
                    {...register(`categories.${index}.name`)}
                    className={`w-full rounded-xl border bg-inset px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-faint ${
                      errors.categories?.[index]?.name
                        ? "border-rose-line focus:border-rose-dot focus:bg-rose-soft"
                        : "border-line focus:border-amber-dot focus:bg-surface-hover"
                    }`}
                  />

                  {errors.categories?.[index]?.name && (
                    <p className="text-xs text-rose-fg">
                      {errors.categories[index].name.message}
                    </p>
                  )}
                </div>

                <div className="w-24 shrink-0 space-y-1 sm:w-28">
                  <input
                    type="number"
                    step="any"
                    placeholder="Amount"
                    {...register(`categories.${index}.amount`)}
                    className={`num w-full rounded-xl border bg-inset px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-faint ${
                      errors.categories?.[index]?.amount
                        ? "border-rose-line focus:border-rose-dot focus:bg-rose-soft"
                        : "border-line focus:border-amber-dot focus:bg-surface-hover"
                    }`}
                  />

                  {errors.categories?.[index]?.amount && (
                    <p className="text-xs text-rose-fg">
                      {errors.categories[index].amount.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-faint transition hover:bg-rose-soft hover:text-rose-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-faint"
                  aria-label="Remove category"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 ${
            totalMatches
              ? "border-line-soft bg-inset"
              : "border-rose-line bg-rose-soft"
          }`}
        >
          <span className="text-[12.54px] font-bold uppercase tracking-wider text-ink-muted">
            Total
            {!totalMatches && (
              <span className="num ml-2 normal-case tracking-normal text-rose-fg">
                {difference > 0 ? "+" : "−"}
                {Math.abs(difference).toFixed(2)} off
              </span>
            )}
          </span>

          <span
            className={`num text-base font-bold ${
              totalMatches ? "text-amber-fg" : "text-rose-fg"
            }`}
          >
            {total.toFixed(2)} / {originalTotal.toFixed(2)}
          </span>
        </div>

        <Button
          type="submit"
          loading={submitting}
          disabled={!totalMatches || submitting}
        >
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}
