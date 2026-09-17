import Spinner from "@/components/common/Spinner";

// Shown while a route segment loads, in the same shape the pages use for
// their own data loading, so navigation and fetching look alike.
export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Spinner size={32} />

      <p className="text-sm text-ink-faint">Loading…</p>
    </main>
  );
}
