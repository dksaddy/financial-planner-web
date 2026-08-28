"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { createTargetSchema } from "@/validations/targets.validation";
import { createTarget } from "@/services/targets.service";

export default function AddTargetModal({
  open,
  onClose,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTargetSchema),
    defaultValues: {
      name: "",
      target_amount: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({ name: "", target_amount: "" });
    setImage(null);
  }, [open, reset]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await createTarget({
        ...data,
        image,
      });

      toast.success(response.message);

      onSuccess?.();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create target"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Target"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
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

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Picture (optional)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files?.[0] ?? null)
            }
            className="block w-full text-sm text-gray-600
            file:mr-3 file:rounded-lg file:border-0
            file:bg-blue-50 file:px-3 file:py-2
            file:text-sm file:font-medium file:text-blue-700
            hover:file:bg-blue-100"
          />
        </div>

        <Button
          type="submit"
          loading={submitting}
        >
          Add Target
        </Button>
      </form>
    </Modal>
  );
}