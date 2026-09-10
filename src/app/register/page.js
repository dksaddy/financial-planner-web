"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import AuthLayout from "@/layouts/AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { registerSchema } from "@/validations/auth.validation";
import { register as registerUser } from "@/services/auth.service";
import { useIsAuthenticated } from "@/lib/useIsAuthenticated";

export default function RegisterPage() {
  const router = useRouter();

  // Already signed in: this page has nothing to offer, so bounce to the
  // dashboard. `replace` rather than `push` so Back does not land here again.
  const authenticated = useIsAuthenticated();

  useEffect(() => {
    if (authenticated) router.replace("/dashboard");
  }, [authenticated, router]);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await registerUser(data);

      toast.success(response.message);

      reset();

      router.push("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Nothing to show while the redirect above is in flight — rendering the form
  // would flash a signup box at someone who is already signed in.
  if (authenticated) return null;

  return (
    <AuthLayout title="Create Account">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <Input
          label="Name"
          name="name"
          placeholder="Enter your name"
          register={register}
          error={errors.name}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          register={register}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          register={register}
          error={errors.password}
        />

        <Button
          type="submit"
          loading={loading}
        >
          Register
        </Button>

        <p className="text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-indigo-fg transition hover:brightness-110"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}