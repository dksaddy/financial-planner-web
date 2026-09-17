import Link from "next/link";

export const metadata = {
  title: "Page not found · Financial Planner",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-surface px-8 py-10 text-center">
        <p className="num text-3xl font-bold text-ink">404</p>

        <h1 className="text-lg font-bold uppercase tracking-wider text-ink">
          Page not found
        </h1>

        <p className="text-sm text-ink-muted">
          There is nothing at this address.
        </p>

        <Link
          href="/"
          className="block text-sm font-bold text-indigo-fg transition hover:brightness-110"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
