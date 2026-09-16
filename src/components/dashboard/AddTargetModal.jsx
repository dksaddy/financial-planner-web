"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiImage, FiX } from "react-icons/fi";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { createTargetSchema } from "@/validations/targets.validation";
import { createTarget } from "@/services/targets.service";
import { IMAGE_ACCEPT, IMAGE_RULES, imageError } from "@/lib/image";

export default function AddTargetModal({
  open,
  onClose,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);

  // The chosen file and its object URL move together in one state value, so
  // the URL is minted and revoked in the handlers rather than in an effect —
  // the same shape AvatarCard uses.
  const [selection, setSelection] = useState(null);
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

  const revokeSelection = () => {
    if (selection) URL.revokeObjectURL(selection.url);
  };

  const handleNewFile = (file) => {
    // Refused here rather than by the API, which saves the upload. The
    // current picture, if any, stays.
    const error = file && imageError(file);

    if (error) {
      toast.error(error);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    revokeSelection();

    setSelection(
      file ? { file, url: URL.createObjectURL(file) } : null
    );
  };

  const clearPicture = () => {
    revokeSelection();

    setSelection(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Clearing on the way out rather than on the way in: every close runs
  // through here — the backdrop, Escape, Cancel and a successful submit — so
  // the modal is already empty by its next open, with no reset effect and no
  // leaked object URL. Unlike `clearPicture` this leaves the file input alone,
  // because Modal unmounts its whole subtree on close and the next open gets a
  // brand new, empty input anyway.
  const handleClose = () => {
    revokeSelection();

    setSelection(null);
    reset({ name: "", target_amount: "" });
    onClose();
  };

  const displayedPreview = selection?.url;

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await createTarget({
        ...data,
        image: selection?.file ?? null,
      });

      toast.success(response.message);

      onSuccess?.();

      handleClose();
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
      onClose={handleClose}
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
                    {IMAGE_RULES}
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