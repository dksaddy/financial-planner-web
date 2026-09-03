"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { depositSavingPlanSchema } from "@/validations/savingPlans.validation";
import { depositToSavingPlan } from "@/services/savingPlans.service";

export default function DepositModal({
  open,
  onClose,
  onSuccess,
  plan,
}) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await depositToSavingPlan(
        plan.id,
        data.amount
      );

      toast.success(response.message);

      onSuccess?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add deposit"
      );
    } finally {
      setSubmitting(false);
    }
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
        <div className="flex items-center justify-between rounded-xl border border-line bg-surface px-3 py-2.5 text-xs text-ink-muted">
          <span className="num">
            Deposited{" "}
            <span className="font-bold text-emerald-fg">
              {Number(plan.currentlyDeposited).toFixed(2)}
            </span>
          </span>

          <span className="num">
            Target{" "}
            <span className="font-bold text-ink">
              {Number(plan.depositAmount).toFixed(2)}
            </span>
          </span>
        </div>

        <Input
          label="Deposit Amount"
          name="amount"
          type="number"
          placeholder="e.g. 500"
          register={register}
          error={errors.amount}
        />

        <Button
          type="submit"
          loading={submitting}
        >
          Add Deposit
        </Button>
      </form>
    </Modal>
  );
}