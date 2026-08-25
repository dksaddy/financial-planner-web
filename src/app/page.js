import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Financial Planner
        </h1>
        <p className="mb-8 text-gray-600">
          Track your expenses, savings, and targets in one place.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-blue-600 px-6 py-2 text-blue-600 transition hover:bg-blue-50"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}