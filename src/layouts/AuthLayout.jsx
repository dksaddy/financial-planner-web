import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import Card from "@/components/common/Card";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function AuthLayout({
  title,
  children,
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      {/* Mirrors the theme toggle on the right — both auth pages get a way
          back to the landing page. */}
      <Link
        href="/"
        className="group absolute left-5 top-5 flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 text-xs font-bold uppercase tracking-wider text-ink-muted transition hover:border-line-strong hover:bg-surface-hover hover:text-ink"
      >
        <FiArrowLeft
          size={15}
          className="transition-transform group-hover:-translate-x-0.5"
        />
        Home
      </Link>

      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <div className="reveal w-full max-w-md">
        <Card title={title}>
          {children}
        </Card>
      </div>
    </main>
  );
}
