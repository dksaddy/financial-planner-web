"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

import Spinner from "@/components/common/Spinner";
import AvatarCard from "@/components/profile/AvatarCard";
import LogoutButton from "@/components/profile/LogoutButton";
import AvatarAlbum from "@/components/profile/AvatarAlbum";
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

  // Fetches and reports failures, but never touches React state — that is
  // left to the caller. Keeping the commit out of here is what lets the mount
  // effect below cancel a response it no longer wants. The cookie write stays,
  // because the dashboard header reads the user out of the cookie and must be
  // kept in step with the server after every profile change.
  const loadProfile = useCallback(async () => {
    try {
      const response = await getProfile();

      setUser(response.data);

      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load profile"
      );

      return null;
    }
  }, []);

  // Passed to the cards as `onSuccess` after they mutate the profile.
  const fetchProfile = useCallback(async () => {
    const data = await loadProfile();

    if (data) setProfile(data);
  }, [loadProfile]);

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

    let active = true;

    loadProfile().then((data) => {
      if (!active) return;

      if (data) setProfile(data);
      setLoading(false);
    });

    // Drops a response that arrives after this effect has been superseded.
    return () => {
      active = false;
    };
  }, [router, loadProfile]);

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
      {/* No `flex-wrap`: with it the title block took its full content width
          and pushed Logout onto a row of its own. `min-w-0` lets that block
          shrink instead — the email and joined date already wrap inside it,
          so it gives way gracefully and the button stays put. */}
      <div className="reveal mb-6 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 items-start gap-3.5">
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

          {/* `min-w-0` again: a flex item defaults to min-width:auto at every
              level, so without it this block refuses to shrink and the row
              overflows rather than compressing. */}
          <div className="min-w-0">
            <h1 className="text-[20.9px] font-bold uppercase leading-tight sm:text-[29.64px] tracking-[0.06em] text-ink">
              Profile
            </h1>

            {/* Each stat carries its own dot instead of one leading dot and
                "·" separators: when the line wraps on a phone the marker
                stays with its own figure. */}
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
              {/* An address has no spaces to break at, so it truncates rather
                  than pushing the row wider than the screen. */}
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-dot" />

                <span className="truncate">{profile.email}</span>
              </span>

              {memberSince && (
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-dot" />
                  joined {memberSince}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Hidden below `sm`, where this header has no room beside the title
            and the address — the Photo card carries it there instead. */}
        <LogoutButton
          onLogout={handleLogout}
          loggingOut={loggingOut}
          className="hidden sm:flex"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        <div
          className="reveal space-y-4 lg:col-span-5"
          style={{ animationDelay: "70ms" }}
        >
          <AvatarCard
            profile={profile}
            onSuccess={fetchProfile}
            onLogout={handleLogout}
            loggingOut={loggingOut}
          />

          <AvatarAlbum profile={profile} onSuccess={fetchProfile} />
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
