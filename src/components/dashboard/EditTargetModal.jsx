"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { updateTargetSchema } from "@/validations/targets.validation";
import { updateTarget } from "@/services/targets.service";

export default function EditTargetModal({
  open,
  onClose,
  target,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateTargetSchema),
    defaultValues: {
      name: "",
      target_amount: "",
    },
  });

  useEffect(() => {
    if (!open || !target) return;

    reset({
      name: target.name ?? "",
      target_amount: target.target_amount ?? "",
    });
  }, [open, target, reset]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await updateTarget(target.id, data);

      toast.success(response.message);

      onSuccess?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update target"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Target">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Target Name"
          name="name"
          placeholder="e.g. Key Caps"
          register={register}
          error={errors.name}
        />

        <Input
          label="Target Amount"
          name="target_amount"
          type="number"
          placeholder="e.g. 1800"
          register={register}
          error={errors.target_amount}
        />

        <Button type="submit" loading={submitting}>
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}