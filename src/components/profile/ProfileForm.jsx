"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiUser } from "react-icons/fi";

import Section from "@/components/dashboard/Section";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { updateProfileSchema } from "@/validations/user.validation";
import { updateProfile } from "@/services/user.service";

export default function ProfileForm({ profile, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      salary: "",
    },
  });

  // The page fetches the profile after mount, and refetches after every
  // save, so the form follows whatever came back last. Resetting also clears
  // the dirty flag, which is what re-disables the save button after a save.
  useEffect(() => {
    if (!profile) return;

    reset({
      name: profile.name ?? "",
      email: profile.email ?? "",
      // Inputs always hand back strings, so keep the baseline a string too —
      // otherwise retyping the original salary still counts as a change.
      salary: profile.salary == null ? "" : String(profile.salary),
    });
  }, [profile, reset]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await updateProfile(data);

      toast.success(response.message);

      onSuccess?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section title="Account Details" icon={FiUser} accent="indigo">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          name="name"
          placeholder="Your name"
          register={register}
          error={errors.name}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          register={register}
          error={errors.email}
        />

        <Input
          label="Monthly Salary"
          name="salary"
          type="number"
          placeholder="e.g. 45000"
          register={register}
          error={errors.salary}
        />

        <Button type="submit" loading={submitting} disabled={!isDirty || submitting}>
          Save Changes
        </Button>
      </form>
    </Section>
  );
}
