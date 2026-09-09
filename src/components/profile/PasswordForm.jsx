"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiLock } from "react-icons/fi";

import Section from "@/components/dashboard/Section";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { changePasswordSchema } from "@/validations/user.validation";
import { changePassword } from "@/services/user.service";

const EMPTY = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function PasswordForm() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await changePassword(data);

      toast.success(response.message);

      // The current token stays valid — the API does not revoke it on a
      // password change — so only the form is cleared, not the session.
      reset(EMPTY);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section title="Password" icon={FiLock} accent="rose">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Current Password"
          name="oldPassword"
          type="password"
          placeholder="Enter current password"
          register={register}
          error={errors.oldPassword}
        />

        <Input
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="At least 8 characters"
          register={register}
          error={errors.newPassword}
        />

        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat new password"
          register={register}
          error={errors.confirmPassword}
        />

        <Button type="submit" loading={submitting}>
          Update Password
        </Button>
      </form>
    </Section>
  );
}
