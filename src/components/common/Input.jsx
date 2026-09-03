export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  register,
  error,
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs font-bold uppercase tracking-wider text-ink-muted"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full rounded-xl border bg-inset px-4 py-2.5 text-sm text-ink
        outline-none transition placeholder:text-ink-faint

        ${
          error
            ? "border-rose-line focus:border-rose-dot focus:bg-rose-soft"
            : "border-line focus:border-indigo-dot focus:bg-surface-hover"
        }`}
      />

      {error && (
        <p className="text-xs text-rose-fg">
          {error.message}
        </p>
      )}
    </div>
  );
}
