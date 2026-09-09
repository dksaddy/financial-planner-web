"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { createExpenseTypeSchema } from "@/validations/expenseTypes.validation";
import { createExpenseType } from "@/services/expenseTypes.service";

const emptyCategory = { name: "", amount: "" };

export default function AddExpenseTypeModal({
  open,
  onClose,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createExpenseTypeSchema),
    defaultValues: {
      name: "",
      categories: [emptyCategory],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  useEffect(() => {
    if (!open) return;

    reset({
      name: "",
      categories: [emptyCategory],
    });
  }, [open, reset]);

  const categoryValues = watch("categories");

  const total = (categoryValues || []).reduce(
    (sum, category) => sum + (Number(category?.amount) || 0),
    0
  );

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await createExpenseType({
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
          "Failed to create expense type"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Expense Type"
      size="lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
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
              className="flex items-center gap-1 text-[13.2px] font-bold uppercase tracking-wider text-amber-fg transition hover:brightness-110"
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

                <div className="w-28 space-y-1">
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

        <div className="flex items-center justify-between rounded-xl border border-line-soft bg-inset px-3.5 py-2.5">
          <span className="text-[13.2px] font-bold uppercase tracking-wider text-ink-muted">
            Total
          </span>

          <span className="num text-base font-bold text-amber-fg">
            {total.toFixed(2)}
          </span>
        </div>

        <Button
          type="submit"
          loading={submitting}
        >
          Add Expense Type
        </Button>
      </form>
    </Modal>
  );
}