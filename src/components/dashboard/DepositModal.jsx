"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import PasswordConfirmModal, {
  usePasswordConfirm,
} from "@/components/common/PasswordConfirmModal";

import { depositSavingPlanSchema } from "@/validations/savingPlans.validation";
import { depositToSavingPlan } from "@/services/savingPlans.service";

export default function DepositModal({
  open,
  onClose,
  onSuccess,
  plan,
}) {
  const passwordConfirm = usePasswordConfirm();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(depositSavingPlanSchema),
    defaultValues: {
      amount: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({ amount: "" });
  }, [open, reset]);

  if (!plan) return null;

  const remaining = Number(plan.remaining ?? 0);

  const onSubmit = async (data) => {
    // Same cap the API enforces, compared in cents; checked here so the
    // mistake shows on the field instead of only as a toast.
    if (Math.round(data.amount * 100) > Math.round(remaining * 100)) {
      setError("amount", {
        message: `Deposit exceeds the remaining ${remaining.toFixed(2)}`,
      });
      return;
    }

    // Hands off to the password modal, which runs this once the password is
    // confirmed and keeps itself open if the API rejects it. Errors are its
    // job from here, which is why there is no try/catch around the call.
    passwordConfirm.confirm({
      title: "Confirm Deposit",
      description: `Enter your account password to add ${Number(
        data.amount
      ).toFixed(2)} to ${plan.name}.`,
      confirmLabel: "Deposit",
      errorFallback: "Failed to add deposit",

      action: async (password) => {
        const response = await depositToSavingPlan(
          plan.id,
          data.amount,
          password
        );

        toast.success(response.message);

        onSuccess?.();

        onClose();
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Deposit · ${plan.name}`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Label over value in three fixed columns, so the figures never
            wrap into each other whichever face the theme sets them in. */}
        <div className="grid grid-cols-3 gap-3 rounded-xl border border-line bg-surface px-4 py-3">
          <Figure
            label="Deposited"
            value={Number(plan.currentlyDeposited).toFixed(2)}
            className="text-emerald-fg"
          />

          <Figure label="Remaining" value={remaining.toFixed(2)} />

          <Figure
            label="Target"
            value={Number(plan.depositAmount).toFixed(2)}
          />
        </div>

        <Input
          label="Deposit Amount"
          name="amount"
          type="number"
          placeholder="e.g. 500"
          register={register}
          error={errors.amount}
        />

        <Button type="submit">Add Deposit</Button>
      </form>

      <PasswordConfirmModal {...passwordConfirm.modalProps} />
    </Modal>
  );
}

function Figure({ label, value, className = "text-ink" }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-ink-muted">{label}</p>

      <p className={`num mt-0.5 truncate text-sm font-bold ${className}`}>
        {value}
      </p>
    </div>
  );
}
