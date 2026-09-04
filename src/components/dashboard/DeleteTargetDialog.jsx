"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";

import { deleteTarget } from "@/services/targets.service";

export default function DeleteTargetDialog({
  open,
  onClose,
  target,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    try {
      setSubmitting(true);

      const response = await deleteTarget(target.id);

      toast.success(response.message);

      onSuccess?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete target"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Target">
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-rose-line bg-rose-soft p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-soft text-rose-fg ring-1 ring-rose-line">
            <FiAlertTriangle size={16} />
          </span>

          <p className="text-sm text-ink-muted">
            Delete{" "}
            <span className="font-bold text-ink">{target?.name}</span>?
            This action can&apos;t be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink"
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