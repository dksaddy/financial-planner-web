"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";

import Spinner from "@/components/common/Spinner";
import AvatarCard from "@/components/profile/AvatarCard";
import ProfileForm from "@/components/profile/ProfileForm";
import PasswordForm from "@/components/profile/PasswordForm";

import { getProfile } from "@/services/user.service";
import { logout as logoutApi } from "@/services/auth.service";
import { isAuthenticated, setUser, logout as clearAuth } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();

      setProfile(response.data);

      // The dashboard header reads the user out of the cookie, so keep the
      // cookie in step with the server after every profile change.
      setUser(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutApi();
    } catch (error) {
      // Clear local authentication even if API logout fails.
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner size={32} />

        <p className="text-sm text-ink-faint">Loading your profile…</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-2xl border border-line bg-surface px-8 py-10 text-center">
          <p className="text-ink-muted">Unable to load profile.</p>
        </div>
      </main>
    );
  }

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="reveal mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            href="/dashboard"
            className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink"
            aria-label="Back to dashboard"
          >
            <FiArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          </Link>

          <div>
            <h1 className="text-[31.2px] font-bold uppercase leading-tight tracking-[0.06em] text-ink">
              Profile
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-dot" />
              {profile.email}
              {memberSince && ` · joined ${memberSince}`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="group flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-rose-line hover:bg-rose-soft hover:text-rose-fg disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiLogOut
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        <div className="reveal lg:col-span-5" style={{ animationDelay: "70ms" }}>
          <AvatarCard profile={profile} onSuccess={fetchProfile} />
        </div>

        <div
          className="reveal space-y-4 lg:col-span-7"
          style={{ animationDelay: "140ms" }}
        >
          <ProfileForm profile={profile} onSuccess={fetchProfile} />

          <PasswordForm />
        </div>
      </div>
    </main>
  );
}
