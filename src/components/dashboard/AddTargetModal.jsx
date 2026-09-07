"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiImage, FiX, FiCheck } from "react-icons/fi";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

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

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [existingImages, setExistingImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
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

  useEffect(() => {
    if (!open) return;

    reset({ name: "", target_amount: "" });
    setImage(null);
    setSelectedExistingUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    const fetchExistingImages = async () => {
      try {
        setLoadingImages(true);
        const response = await getTargetImages();
        setExistingImages(response.data ?? []);
      } catch {
        // Picking a past picture is a bonus feature — if it fails to
        // load, uploading a new image still works fine.
        setExistingImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchExistingImages();
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

  // Uploading a new file and picking an existing picture are mutually
  // exclusive — choosing one clears the other.
  const handleNewFile = (file) => {
    setImage(file ?? null);
    setSelectedExistingUrl(null);
  };

  const handleSelectExisting = (url) => {
    setSelectedExistingUrl((current) => (current === url ? null : url));
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearPicture = () => {
    setImage(null);
    setSelectedExistingUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayedPreview = previewUrl || selectedExistingUrl;

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await createTarget({
        ...data,
        image,
        existingImageUrl: selectedExistingUrl,
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
                  <img
                    src={displayedPreview}
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

            {displayedPreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearPicture();
                }}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-faint transition hover:text-rose-fg"
              >
                <FiX size={12} strokeWidth={2.6} />
                Remove
              </button>
            )}
          </div>

          {loadingImages && (
            <p className="pt-1 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
              Loading past pictures…
            </p>
          )}

          {!loadingImages && existingImages.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-faint">
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
                      <img
                        src={img.image_url}
                        alt={img.name}
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