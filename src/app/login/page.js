"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import AuthLayout from "@/layouts/AuthLayout";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import { loginSchema } from "@/validations/auth.validation";
import { login as loginUser } from "@/services/auth.service";
import { setToken, setUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await loginUser(data);

      setToken(response.data.token);
      setUser(response.data.user);

      toast.success(response.message);

      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
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
          Login
        </Button>
      </form>
    </AuthLayout>
  );
}