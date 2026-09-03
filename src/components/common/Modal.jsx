"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

const SIZES = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  // The modal only opens from a client interaction, so the server never
  // renders it and there is nothing to hydrate-mismatch on.
  if (!open || typeof document === "undefined") return null;

  // The dashboard cards use backdrop-blur, and a backdrop-filter makes an
  // element the containing block for its fixed-position descendants. Rendering
  // the modal in place would anchor it to the card (and get it clipped by the
  // card's overflow-hidden), so it goes into a portal on document.body.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fade-in absolute inset-0 bg-scrim backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={`panel-in relative max-h-[90vh] w-full ${
        SIZES[size] || SIZES.md
      } overflow-y-auto overflow-x-hidden rounded-2xl border border-line bg-panel p-5 shadow-panel`}>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 opacity-[0.12] blur-2xl"
        />

        <div className="relative mb-4 flex items-center justify-between gap-3">
          <h2 className="truncate text-sm font-bold uppercase tracking-wider text-ink">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-ink-muted transition hover:bg-surface-hover hover:text-ink"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="relative">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
