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
      className={`flex w-full items-center justify-center rounded-xl
      bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5
      text-sm font-bold uppercase tracking-wider text-white
      shadow-lg shadow-indigo-500/30 transition
      hover:brightness-110 hover:shadow-indigo-500/50
      active:scale-[0.98]
      disabled:cursor-not-allowed
      disabled:opacity-70 disabled:active:scale-100
      ${className}`}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
