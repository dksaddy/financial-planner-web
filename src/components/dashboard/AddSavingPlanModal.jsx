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

import { createSavingPlanSchema } from "@/validations/savingPlans.validation";
import { createSavingPlan } from "@/services/savingPlans.service";
import { DEFAULT_TAX_RATE } from "@/constants/limits";

const DEFAULT_VALUES = {
  name: "",
  amount: "",
  frequency: "",
  months: "",
  depositAmount: "",
  depositFrequency: "",
  withdrawalAmount: "",
  taxRate: String(DEFAULT_TAX_RATE),
};

export default function AddSavingPlanModal({
  open,
  onClose,
  onSuccess,
}) {
  const passwordConfirm = usePasswordConfirm();

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

  const onSubmit = (data) => {
    passwordConfirm.confirm({
      title: "Confirm New Plan",
      description: `Enter your account password to create ${data.name}.`,
      confirmLabel: "Create",
      errorFallback: "Failed to create saving plan",

      action: async (password) => {
        const response = await createSavingPlan(data, password);

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

        <Input
          label="Tax Rate (%)"
          name="taxRate"
          type="number"
          placeholder="e.g. 15"
          hint="Taken from the profit"
          register={register}
          error={errors.taxRate}
        />

        <Button type="submit">Create Plan</Button>
      </form>

      <PasswordConfirmModal {...passwordConfirm.modalProps} />
    </Modal>
  );
}