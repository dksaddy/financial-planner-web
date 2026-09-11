"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiImage, FiTrash2 } from "react-icons/fi";

import Section from "@/components/dashboard/Section";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";

import {
  getAvatarAlbum,
  selectAvatarImage,
  deleteAvatarImage,
} from "@/services/user.service";

export default function AvatarAlbum({ profile, onSuccess }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectingName, setSelectingName] = useState(null);
  // Bumped by the delete handler to ask the effect below for a fresh list.
  // Keeping the fetch in one place — the effect — is what lets it own its own
  // cancellation; a second fetch path could not be cancelled by it.
  const [reloadToken, setReloadToken] = useState(0);

  // Also keyed on the avatar rather than the whole profile: a new upload both
  // adds a file to the album and changes `avatar_url`, so this refetches on
  // upload without firing for an unrelated name or salary edit.
  useEffect(() => {
    let active = true;

    getAvatarAlbum()
      .then((response) => {
        if (active) setPhotos(response.data ?? []);
      })
      .catch((error) => {
        if (active) {
          toast.error(
            error.response?.data?.message || "Failed to load your photos"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    // Drops a response that lands after this effect has been superseded, so a
    // slow first request can't overwrite the list a later one already wrote.
    return () => {
      active = false;
    };
  }, [reloadToken, profile?.avatar_url]);

  // No confirm step: picking a different photo is reversible in one click, and
  // the old one stays in the album either way.
  const handleSelect = async (photo) => {
    try {
      setSelectingName(photo.name);

      const response = await selectAvatarImage(photo.name);

      toast.success(response.message);

      // Changes `avatar_url`, which the effect above is keyed on — so the
      // album refetches and `is_current` moves on its own.
      onSuccess?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to use this photo"
      );
    } finally {
      setSelectingName(null);
    }
  };

  const handleDelete = async () => {
    if (!pending) return;

    try {
      setDeleting(true);

      const response = await deleteAvatarImage(pending.name);

      toast.success(response.message);

      setPending(null);

      setReloadToken((token) => token + 1);

      // The deleted file is never the current avatar — the API refuses that —
      // so the profile itself is untouched. Still told, in case a parent wants
      // to know the album moved.
      onSuccess?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete photo"
      );
    } finally {
      setDeleting(false);
    }
  };

  // One request at a time across the whole grid: both actions refetch the
  // album, so letting a second start would race the list out from under it.
  const busy = deleting || Boolean(selectingName);

  return (
    <Section title="Photo Album" icon={FiImage} accent="violet">
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size={22} />
        </div>
      ) : photos.length === 0 ? (
        <p className="py-6 text-center text-[12.54px] text-ink-faint">
          Every photo you upload is kept here.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          {photos.map((photo) => (
            <div
              key={photo.name}
              className={`group/tile relative aspect-square overflow-hidden rounded-xl border bg-inset ${
                photo.is_current
                  ? "border-violet-line ring-1 ring-violet-line"
                  : "border-line"
              }`}
            >
              <Image
                src={photo.url}
                alt=""
                fill
                // Three to a row inside the narrow profile column, so the
                // largest a tile ever gets is roughly a third of it.
                sizes="(min-width: 1024px) 150px, 33vw"
                className="object-cover"
                unoptimized // preserves gif animation
              />

              {photo.is_current ? (
                // The photo in use is inert: it is already the avatar, and the
                // API rejects deleting it, so neither control would do
                // anything.
                <span className="absolute inset-x-0 bottom-0 bg-scrim py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white">
                  In use
                </span>
              ) : (
                // Two sibling buttons rather than one nested in the other —
                // a button inside a button is invalid markup and browsers
                // resolve the click unpredictably. Delete is painted over
                // select and takes the corner it occupies.
                <>
                  <button
                    type="button"
                    onClick={() => handleSelect(photo)}
                    disabled={busy}
                    aria-label="Use this photo"
                    className="absolute inset-0 flex items-center justify-center bg-scrim text-white opacity-0 transition focus-visible:opacity-100 disabled:cursor-not-allowed group-hover/tile:opacity-100"
                  >
                    {selectingName === photo.name ? (
                      <Spinner size={16} />
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Use
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPending(photo)}
                    disabled={busy}
                    aria-label="Delete this photo"
                    className="absolute right-1 top-1 z-10 rounded-lg bg-scrim p-1.5 text-white opacity-0 transition hover:text-rose-300 focus-visible:opacity-100 disabled:cursor-not-allowed group-hover/tile:opacity-100"
                  >
                    <FiTrash2 size={13} strokeWidth={2.2} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(pending)}
        onClose={() => !deleting && setPending(null)}
        title="Delete Photo"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-rose-line bg-rose-soft p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-soft text-rose-fg ring-1 ring-rose-line">
              <FiAlertTriangle size={16} />
            </span>

            <p className="text-sm text-ink-muted">
              This photo will be removed from storage for good. This action
              can&apos;t be undone.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPending(null)}
              disabled={deleting}
              className="flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-500/30 transition hover:brightness-110 hover:shadow-rose-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
            >
              {deleting ? <Spinner /> : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </Section>
  );
}
