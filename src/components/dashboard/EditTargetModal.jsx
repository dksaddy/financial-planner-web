"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiImage, FiX } from "react-icons/fi";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { updateTargetSchema } from "@/validations/targets.validation";
import { updateTarget } from "@/services/targets.service";
import {
  IMAGE_ACCEPT,
  TARGET_IMAGE_RULES,
  imageError,
} from "@/lib/image";
import { TARGET_IMAGE_MAX_MB } from "@/constants/limits";

export default function EditTargetModal({
  open,
  onClose,
  target,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  // A newly chosen file and its object URL, as in AddTargetModal. Separate
  // from `removed`, which says the target's existing picture is to be dropped.
  const [selection, setSelection] = useState(null);
  const [removed, setRemoved] = useState(false);
  const fileInputRef = useRef(null);

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

  const revokeSelection = () => {
    if (selection) URL.revokeObjectURL(selection.url);
  };

  const handleNewFile = (file) => {
    const error = file && imageError(file, TARGET_IMAGE_MAX_MB);

    if (error) {
      toast.error(error);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    revokeSelection();

    setSelection(file ? { file, url: URL.createObjectURL(file) } : null);
    setRemoved(false);
  };

  // Clears a new choice first; only with none left does it mark the saved
  // picture for removal.
  const clearPicture = () => {
    if (selection) {
      revokeSelection();
      setSelection(null);
    } else {
      setRemoved(true);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Every close runs through here, so the picture state never carries over to
  // the next target opened.
  const handleClose = () => {
    revokeSelection();

    setSelection(null);
    setRemoved(false);
    onClose();
  };

  const displayedPreview =
    selection?.url ?? (removed ? null : target?.image_url ?? null);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await updateTarget(target.id, {
        ...data,
        image: selection?.file ?? null,
        removeImage: removed && !selection && Boolean(target.image_url),
      });

      toast.success(response.message);

      onSuccess?.();

      handleClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update target"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Edit Target">
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

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Picture (optional)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            onChange={(e) => handleNewFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-inset text-ink-faint transition hover:border-line-strong hover:bg-inset-hover hover:text-ink-muted"
            >
              {displayedPreview ? (
                <>
                  <Image
                    src={displayedPreview}
                    alt="Target preview"
                    fill
                    sizes="(min-width: 640px) 448px, 90vw"
                    unoptimized // preserves gif animation
                    className="object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-scrim text-[11.4px] font-bold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
                    Change
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center gap-1.5">
                  <FiImage size={20} strokeWidth={2} />
                  <span className="text-[11.4px] font-bold uppercase tracking-wider">
                    Add image
                  </span>

                  <span className="text-[12.54px] normal-case">
                    {TARGET_IMAGE_RULES}
                  </span>
                </span>
              )}
            </button>

            {displayedPreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearPicture();
                }}
                className="flex items-center gap-1 text-[12.54px] font-bold uppercase tracking-wider text-ink-faint transition hover:text-rose-fg"
              >
                <FiX size={12} strokeWidth={2.6} />
                Remove
              </button>
            )}
          </div>
        </div>

        <Button type="submit" loading={submitting}>
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}
