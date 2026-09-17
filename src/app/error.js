"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

import Button from "@/components/common/Button";

// Catches a render error anywhere below the root layout, so one broken card
// shows this instead of blanking the whole page. The layout — theme, fonts,
// toaster — stays mounted around it.
export default function Error({ error, unstable_retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-surface px-8 py-10 text-center">
        <h1 className="text-lg font-bold uppercase tracking-wider text-ink">
          Something went wrong
        </h1>

        <p className="text-sm text-ink-muted">
          This page hit an unexpected error. Your data is safe — try again, or
          head back to the dashboard.
        </p>

        {error?.digest && (
          <p className="num text-[12.54px] text-ink-faint">
            Reference: {error.digest}
          </p>
        )}

        <Button onClick={() => unstable_retry()}>Try again</Button>

        <Link
          href="/dashboard"
          className="block text-sm font-bold text-indigo-fg transition hover:brightness-110"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
