"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiCamera, FiUser, FiX } from "react-icons/fi";

import Section from "@/components/dashboard/Section";
import Button from "@/components/common/Button";

import { isLocalPreview } from "@/lib/image";
import LogoutButton from "@/components/profile/LogoutButton";
import { updateAvatar } from "@/services/user.service";

// Matches the multer filter on the API — rejecting here saves a round trip
// and gives a clearer message than the server's generic one.
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB, same limit as the API.

export default function AvatarCard({
  profile,
  onSuccess,
  onLogout,
  loggingOut,
}) {
  // File and its object URL move together in one state value, so the URL is
  // minted and revoked in the handlers rather than in an effect.
  const [selection, setSelection] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const initial = profile?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  const displayed = selection?.url || profile?.avatar_url || null;

  const revokeCurrent = () => {
    if (selection?.url) URL.revokeObjectURL(selection.url);
  };

  const handleFile = (selected) => {
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      toast.error("Only JPG, PNG, WEBP and GIF images are allowed.");
      return;
    }

    if (selected.size > MAX_SIZE) {
      toast.error("Image must be 5MB or smaller.");
      return;
    }

    revokeCurrent();

    setSelection({
      file: selected,
      url: URL.createObjectURL(selected),
    });
  };

  const clearSelection = () => {
    revokeCurrent();
    setSelection(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selection) return;

    try {
      setUploading(true);

      const response = await updateAvatar(selection.file);

      toast.success(response.message);

      clearSelection();

      onSuccess?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update photo"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Section
      title="Photo"
      icon={FiUser}
      accent="violet"
      // Only below `sm`. The page header owns this at wider widths; here it
      // fills a header slot that would otherwise sit empty on a phone.
      actions={
        <LogoutButton
          onLogout={onLogout}
          loggingOut={loggingOut}
          className="flex sm:hidden"
        />
      }
    >
      <div className="flex flex-col items-center gap-4 py-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-32 w-32 shrink-0 overflow-hidden rounded-full border border-line bg-inset text-ink-faint transition hover:border-line-strong"
          aria-label="Change profile photo"
        >
          {displayed ? (
            <Image
              src={displayed}
              alt={profile?.name || "Profile photo"}
              fill
              sizes="128px"
              unoptimized={isLocalPreview(displayed)}
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-400 to-purple-500 text-4xl font-bold text-white">
              {initial}
            </span>
          )}

          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-scrim text-white opacity-0 transition group-hover:opacity-100">
            <FiCamera size={18} strokeWidth={2.2} />

            <span className="text-[11.4px] font-bold uppercase tracking-wider">
              Change
            </span>
          </span>
        </button>

        <div className="text-center">
          <p className="text-sm font-bold text-ink">{profile?.name}</p>

          <p className="text-xs text-ink-faint">{profile?.email}</p>
        </div>

        {selection ? (
          <div className="w-full space-y-2">
            <Button
              type="button"
              loading={uploading}
              onClick={handleUpload}
            >
              Save Photo
            </Button>

            <button
              type="button"
              onClick={clearSelection}
              disabled={uploading}
              className="flex w-full items-center justify-center gap-1 text-[12.54px] font-bold uppercase tracking-wider text-ink-faint transition hover:text-rose-fg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiX size={12} strokeWidth={2.6} />
              Cancel
            </button>
          </div>
        ) : (
          <p className="text-center text-[12.54px] text-ink-faint">
            JPG, PNG, WEBP or GIF · up to 5MB
          </p>
        )}
      </div>
    </Section>
  );
}
