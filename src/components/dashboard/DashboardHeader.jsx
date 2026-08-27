"use client";

export default function DashboardHeader({ user, onLogout }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Dashboard
        </h1>

        {user?.name && (
          <p className="text-sm text-gray-500">
            Welcome, {user.name}
          </p>
        )}
      </div>

      <button
        onClick={onLogout}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-200"
      >
        Logout
      </button>
    </div>
  );
}