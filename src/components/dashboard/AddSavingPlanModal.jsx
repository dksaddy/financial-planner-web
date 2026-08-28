"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { createSavingPlanSchema } from "@/validations/savingPlans.validation";
import { createSavingPlan } from "@/services/savingPlans.service";

const DEFAULT_VALUES = {
  name: "",
  amount: "",
  frequency: "",
  months: "",
  depositAmount: "",
  depositFrequency: "",
  withdrawalAmount: "",
};

export default function AddSavingPlanModal({
  open,
  onClose,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSavingPlanSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;

    reset(DEFAULT_VALUES);
  }, [open, reset]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await createSavingPlan(data);

      toast.success(response.message);

      onSuccess?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create saving plan"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Saving Plan"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Input
          label="Plan Name"
          name="name"
          placeholder="e.g. Emergency Fund"
          register={register}
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Total Amount"
            name="amount"
            type="number"
            placeholder="e.g. 5000"
            register={register}
            error={errors.amount}
          />

          <Input
            label="Frequency (days)"
            name="frequency"
            type="number"
            placeholder="e.g. 7"
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

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Deposit Amount"
            name="depositAmount"
            type="number"
            placeholder="e.g. 500"
            register={register}
            error={errors.depositAmount}
          />

          <Input
            label="Deposit Frequency (days)"
            name="depositFrequency"
            type="number"
            placeholder="e.g. 7"
            register={register}
            error={errors.depositFrequency}
          />
        </div>

        <Input
          label="Withdrawal Amount"
          name="withdrawalAmount"
          type="number"
          placeholder="e.g. 6200"
          register={register}
          error={errors.withdrawalAmount}
        />

        <Button
          type="submit"
          loading={submitting}
        >
          Create Plan
        </Button>
      </form>
    </Modal>
  );
}