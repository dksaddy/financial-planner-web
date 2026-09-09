"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { createSavingPlanSchema } from "@/validations/savingPlans.validation";
import { updateSavingPlan } from "@/services/savingPlans.service";

export default function EditSavingPlanModal({
  open,
  onClose,
  plan,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // `PUT /saving-plans/:id` validates against the create schema — every
    // field is required on an update too.
    resolver: zodResolver(createSavingPlanSchema),
    defaultValues: {
      name: "",
      amount: "",
      frequency: "",
      months: "",
      depositAmount: "",
      depositFrequency: "",
      withdrawalAmount: "",
    },
  });

  useEffect(() => {
    if (!open || !plan) return;

    reset({
      name: plan.name ?? "",
      amount: plan.amount ?? "",
      frequency: plan.frequency ?? "",
      months: plan.months ?? "",
      depositAmount: plan.depositAmount ?? "",
      depositFrequency: plan.depositFrequency ?? "",
      withdrawalAmount: plan.withdrawalAmount ?? "",
    });
  }, [open, plan, reset]);

  if (!plan) return null;

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await updateSavingPlan(plan.id, data);

      toast.success(response.message);

      onSuccess?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update saving plan"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Saving Plan">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Plan Name"
          name="name"
          placeholder="e.g. Emergency Fund"
          register={register}
          error={errors.name}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Deposit Amount"
            name="amount"
            type="number"
            placeholder="e.g. 250"
            register={register}
            error={errors.amount}
          />

          <Input
            label="Deposit Frequency"
            name="frequency"
            type="number"
            placeholder="e.g. 7"
            hint="Week = 7 · Month = 30"
            register={register}
            error={errors.frequency}
          />
        </div>

        <Input
          label="Duration (months)"
          name="months"
          type="number"
          placeholder="e.g. 12"
          register={register}
          error={errors.months}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Total Deposit Amount"
            name="depositAmount"
            type="number"
            placeholder="e.g. 6500"
            register={register}
            error={errors.depositAmount}
          />

          <Input
            label="Deposit Times"
            name="depositFrequency"
            type="number"
            placeholder="e.g. 26"
            register={register}
            error={errors.depositFrequency}
          />
        </div>

        <Input
          label="Withdrawal Amount"
          name="withdrawalAmount"
          type="number"
          placeholder="e.g. 6649"
          register={register}
          error={errors.withdrawalAmount}
        />

        {/* Deposits already made are not part of this form — the update
            endpoint leaves currently_deposited untouched. */}
        <p className="num text-center text-[12.54px] text-ink-faint">
          {Number(plan.currentlyDeposited).toFixed(2)} already deposited stays
          as it is
        </p>

        <Button type="submit" loading={submitting}>
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}
