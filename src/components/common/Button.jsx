import Spinner from "./Spinner";

export default function Button({
  children,
  loading = false,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className={`flex w-full items-center justify-center rounded-lg
      bg-blue-600 px-4 py-2 text-white transition
      hover:bg-blue-700
      disabled:cursor-not-allowed
      disabled:opacity-70
      ${className}`}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}