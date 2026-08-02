export default function Button({
  children,
  type = "button",
  loading = false,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className={`w-full rounded-md bg-blue-600 py-2 font-medium text-white transition
      hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}