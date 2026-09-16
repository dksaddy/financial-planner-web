"use client";

import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

import Modal from "@/components/common/Modal";
import PasswordConfirmModal, {
  usePasswordConfirm,
} from "@/components/common/PasswordConfirmModal";

import { deleteSavingPlan } from "@/services/savingPlans.service";

export default function DeleteSavingPlanDialog({
  open,
  onClose,
  plan,
  onSuccess,
}) {
  const passwordConfirm = usePasswordConfirm();

  const handleDelete = () => {
    passwordConfirm.confirm({
      title: "Confirm Deletion",
      description: `Enter your account password to delete ${plan?.name}. This can't be undone.`,
      confirmLabel: "Delete",
      errorFallback: "Failed to delete saving plan",

      action: async (password) => {
        const response = await deleteSavingPlan(plan.id, password);

        toast.success(response.message);

        onSuccess?.();

        onClose();
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Saving Plan">
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-rose-line bg-rose-soft p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-soft text-rose-fg ring-1 ring-rose-line">
            <FiAlertTriangle size={16} />
          </span>

          <p className="text-sm text-ink-muted">
            Delete <span className="font-bold text-ink">{plan?.name}</span>?
            Its{" "}
            <span className="num font-bold text-ink">
              {Number(plan?.currentlyDeposited ?? 0).toFixed(2)}
            </span>{" "}
            of recorded deposits goes with it, and this can&apos;t be undone.
            Cancel the plan instead to keep the history.
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
            onClick={handleDelete}
            className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-500/30 transition hover:brightness-110 hover:shadow-rose-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
          >
            Delete
          </button>
        </div>
      </div>

      <PasswordConfirmModal {...passwordConfirm.modalProps} />
    </Modal>
  );
}
