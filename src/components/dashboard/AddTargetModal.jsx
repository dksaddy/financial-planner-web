"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiImage, FiX, FiCheck } from "react-icons/fi";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { isLocalPreview } from "@/lib/image";
import { createTargetSchema } from "@/validations/targets.validation";
import {
  createTarget,
  getTargetImages,
} from "@/services/targets.service";

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

  const [existingImages, setExistingImages] = useState([]);
  // Starts true so the first open shows the loading line. A reopen keeps the
  // list already on screen and refreshes it underneath, rather than flashing
  // the spinner again.
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedExistingUrl, setSelectedExistingUrl] = useState(null);

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

  // Refetched on every open so a picture added since last time shows up.
  useEffect(() => {
    if (!open) return;

    let active = true;

    getTargetImages()
      .then((response) => {
        if (active) setExistingImages(response.data ?? []);
      })
      .catch(() => {
        // Picking a past picture is a bonus feature — if it fails to
        // load, uploading a new image still works fine.
        if (active) setExistingImages([]);
      })
      .finally(() => {
        if (active) setLoadingImages(false);
      });

    return () => {
      active = false;
    };
  }, [open]);

  const revokeSelection = () => {
    if (selection) URL.revokeObjectURL(selection.url);
  };

  // Uploading a new file and picking an existing picture are mutually
  // exclusive — choosing one clears the other.
  const handleNewFile = (file) => {
    revokeSelection();

    setSelection(
      file ? { file, url: URL.createObjectURL(file) } : null
    );
    setSelectedExistingUrl(null);
  };

  const handleSelectExisting = (url) => {
    revokeSelection();

    setSelectedExistingUrl((current) => (current === url ? null : url));
    setSelection(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearPicture = () => {
    revokeSelection();

    setSelection(null);
    setSelectedExistingUrl(null);
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
    setSelectedExistingUrl(null);
    reset({ name: "", target_amount: "" });
    onClose();
  };

  const displayedPreview = selection?.url || selectedExistingUrl;

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await createTarget({
        ...data,
        image: selection?.file ?? null,
        existingImageUrl: selectedExistingUrl,
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
            accept="image/*"
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
                    unoptimized={isLocalPreview(displayedPreview)}
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

          {loadingImages && (
            <p className="pt-1 text-[11.4px] font-bold uppercase tracking-wider text-ink-faint">
              Loading past pictures…
            </p>
          )}

          {!loadingImages && existingImages.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="block text-[11.4px] font-bold uppercase tracking-wider text-ink-faint">
                Or reuse an existing picture
              </span>

              <div className="flex flex-wrap gap-2">
                {existingImages.map((img) => {
                  const isSelected =
                    selectedExistingUrl === img.image_url;

                  return (
                    <button
                      key={img.image_url}
                      type="button"
                      title={img.name}
                      onClick={() => handleSelectExisting(img.image_url)}
                      className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border transition ${
                        isSelected
                          ? "border-indigo-dot ring-2 ring-indigo-line"
                          : "border-line hover:border-line-strong"
                      }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={img.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />

                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center bg-scrim">
                          <FiCheck
                            size={16}
                            strokeWidth={3}
                            className="text-white"
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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