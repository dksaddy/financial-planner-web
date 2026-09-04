"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

import { createExpenseRecordSchema } from "@/validations/expenseRecords.validation";
import { updateExpenseRecord } from "@/services/expenseRecords.service";
import { getExpenseTypes } from "@/services/expenseTypes.service";

export default function EditExpenseModal({
  open,
  onClose,
  record,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createExpenseRecordSchema),
    defaultValues: {
      expense_type_id: "",
      date: "",
    },
  });

  // Fetch expense types fresh every time the modal opens, so the
  // dropdown reflects any types added/edited elsewhere in the app.
  useEffect(() => {
    if (!open || !record) return;

    reset({
      expense_type_id: record.expense_type_id ?? "",
      date: record.date ? String(record.date).slice(0, 10) : "",
    });

    const fetchExpenseTypes = async () => {
      try {
        setLoadingTypes(true);

        const response = await getExpenseTypes();

        setExpenseTypes(response.data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load expense types"
        );
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchExpenseTypes();
  }, [open, record, reset]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await updateExpenseRecord(record.id, data);

      toast.success(response.message);

      onSuccess?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update expense"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Expense"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-1">
          <label
            htmlFor="edit_expense_type_id"
            className="block text-xs font-medium uppercase tracking-wider text-ink-muted"
          >
            Expense Type
          </label>

          <select
            id="edit_expense_type_id"
            disabled={loadingTypes}
            {...register("expense_type_id")}
            className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${
              errors.expense_type_id
                ? "border-rose-line focus:border-rose-dot"
                : "border-line focus:border-indigo-dot"
            }`}
          >
            <option value="" className="bg-panel text-ink">
              {loadingTypes ? "Loading..." : "Select an expense type"}
            </option>

            {expenseTypes.map((type) => (
              <option
                key={type.id}
                value={type.id}
                className="bg-panel text-ink"
              >
                {type.name} ({Number(type.total).toFixed(2)})
              </option>
            ))}
          </select>

          {errors.expense_type_id && (
            <p className="text-xs text-rose-fg">
              {errors.expense_type_id.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="edit_date"
            className="block text-xs font-medium uppercase tracking-wider text-ink-muted"
          >
            Date
          </label>

          <input
            id="edit_date"
            type="date"
            {...register("date")}
            className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition ${
              errors.date
                ? "border-rose-line focus:border-rose-dot"
                : "border-line focus:border-indigo-dot"
            }`}
          />

          {errors.date && (
            <p className="text-xs text-rose-fg">
              {errors.date.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={submitting}
        >
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}