"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";

import { deleteExpenseType } from "@/services/expenseTypes.service";

export default function DeleteExpenseTypeDialog({
  open,
  onClose,
  expenseType,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    try {
      setSubmitting(true);

      const response = await deleteExpenseType(expenseType.id);

      toast.success(response.message);

      onSuccess?.();

      onClose();
    } catch (error) {
      // A 409 here is the expected answer, not a failure: the type has been
      // used by a record since the page last loaded. The API's own wording
      // explains it and points at deactivating instead.
      toast.error(
        error.response?.data?.message || "Failed to delete expense type"
      );

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Expense Type">
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-rose-line bg-rose-soft p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-soft text-rose-fg ring-1 ring-rose-line">
            <FiAlertTriangle size={16} />
          </span>

          <p className="text-sm text-ink-muted">
            Delete{" "}
            <span className="font-bold text-ink">{expenseType?.name}</span>?
            This action can&apos;t be undone. It only works while no expense
            record uses this type.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={handleDelete}
            className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-500/30 transition hover:brightness-110 hover:shadow-rose-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
          >
            {submitting ? <Spinner /> : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
