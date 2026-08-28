"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

import { createExpenseRecordSchema } from "@/validations/expenseRecords.validation";
import { createExpenseRecord } from "@/services/expenseRecords.service";
import { getExpenseTypes } from "@/services/expenseTypes.service";

const todayDateString = () =>
  new Date().toISOString().slice(0, 10);

export default function AddExpenseModal({
  open,
  onClose,
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
      date: todayDateString(),
    },
  });

  // Fetch expense types fresh every time the modal opens, so the
  // dropdown reflects any types added/edited elsewhere in the app.
  useEffect(() => {
    if (!open) return;

    reset({
      expense_type_id: "",
      date: todayDateString(),
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
  }, [open, reset]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await createExpenseRecord(data);

      toast.success(response.message);

      onSuccess?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add expense"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Expense"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-1">
          <label
            htmlFor="expense_type_id"
            className="block text-sm font-medium text-gray-700"
          >
            Expense Type
          </label>

          <select
            id="expense_type_id"
            disabled={loadingTypes}
            {...register("expense_type_id")}
            className={`w-full rounded-lg border px-4 py-2 outline-none transition bg-white text-gray-900 disabled:cursor-not-allowed disabled:opacity-70 ${
              errors.expense_type_id
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
          >
            <option value="">
              {loadingTypes ? "Loading..." : "Select an expense type"}
            </option>

            {expenseTypes.map((type) => (
              <option
                key={type.id}
                value={type.id}
                className="bg-white text-gray-900"
              >
                {type.name} ({Number(type.total).toFixed(2)})
              </option>
            ))}
          </select>

          {errors.expense_type_id && (
            <p className="text-sm text-red-500">
              {errors.expense_type_id.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>

          <input
            id="date"
            type="date"
            {...register("date")}
            className={`w-full rounded-lg border px-4 py-2 outline-none transition bg-white text-gray-900 ${
              errors.date
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
          />

          {errors.date && (
            <p className="text-sm text-red-500">
              {errors.date.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={submitting}
        >
          Add Expense
        </Button>
      </form>
    </Modal>
  );
}