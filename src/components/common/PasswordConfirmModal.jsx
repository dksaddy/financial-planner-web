"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiLock } from "react-icons/fi";

import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { confirmPasswordSchema } from "@/validations/savingPlans.validation";

// Every saving-plan mutation is confirmed with the account password. This is
// the one place that asks for it, so the five call sites do not each grow their
// own password field, their own 403 handling and their own reset-on-open.
//
// The request is held as a single piece of state rather than an `open` flag
// plus a pending callback: either there is something to confirm — with the
// copy to show and the action to run — or there is nothing, and the modal is
// closed. There is no state in which it is open with nothing to do.
export function usePasswordConfirm() {
  const [request, setRequest] = useState(null);

  // `action` is a function, so it goes in through an updater — passing it
  // straight to setRequest would have React call it as one.
  const confirm = useCallback((next) => setRequest(() => next), []);

  const close = useCallback(() => setRequest(null), []);

  return {
    confirm,
    modalProps: { request, onClose: close },
  };
}

export default function PasswordConfirmModal({ request, onClose }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(confirmPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const open = Boolean(request);

  // Clears the typed password every time the modal opens, so it is never left
  // in memory between two confirmations — or shown back to whoever opens the
  // next one.
  useEffect(() => {
    if (!open) return;

    reset({ password: "" });
  }, [open, reset]);

  if (!request) return null;

  const {
    title = "Confirm your password",
    description,
    confirmLabel = "Confirm",
    errorFallback = "Action failed",
    action,
  } = request;

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      await action(data.password);

      onClose();
    } catch (error) {
      // 403 is the API saying the password was wrong — and only that, since
      // `assertPassword` runs before every other check. Keep the modal open
      // with the message on the field so it can be retyped; closing here would
      // throw away the work the caller is holding behind this confirmation.
      if (error.response?.status === 403) {
        setError("password", {
          message:
            error.response?.data?.message || "Incorrect password",
        });

        return;
      }

      // Anything else is the action itself failing — a deposit over the cap, a
      // plan that moved on. The password was accepted, so this modal has no
      // more to ask: report it and step out of the way.
      toast.error(
        error.response?.data?.message || errorFallback
      );

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-soft text-indigo-fg ring-1 ring-indigo-line">
            <FiLock size={16} />
          </span>

          <p className="text-sm text-ink-muted">
            {description ||
              "Enter your account password to continue."}
          </p>
        </div>

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Your account password"
          register={register}
          error={errors.password}
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink"
          >
            Cancel
          </button>

          <Button
            type="submit"
            loading={submitting}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
