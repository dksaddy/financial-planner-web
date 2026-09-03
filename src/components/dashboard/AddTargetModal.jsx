"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiImage, FiX } from "react-icons/fi";

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
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

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

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Picture (optional)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files?.[0] ?? null)
            }
            className="hidden"
          />

          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-inset text-ink-faint transition hover:border-line-strong hover:bg-inset-hover hover:text-ink-muted"
            >
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Target preview"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-scrim text-[10px] font-bold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
                    Change
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center gap-1.5">
                  <FiImage size={20} strokeWidth={2} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Add image
                  </span>
                </span>
              )}
            </button>

            {previewUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-faint transition hover:text-rose-fg"
              >
                <FiX size={12} strokeWidth={2.6} />
                Remove
              </button>
            )}
          </div>
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