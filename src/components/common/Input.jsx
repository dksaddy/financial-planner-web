"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  hint,
  register,
  error,
}) {
  const [revealed, setRevealed] = useState(false);

  const isPassword = type === "password";

  // Flipping the input's own type keeps one field (and one registration),
  // so react-hook-form never sees the value change on a reveal.
  const inputType = isPassword && revealed ? "text" : type;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs font-bold uppercase tracking-wider text-ink-muted"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          {...register(name)}
          className={`w-full rounded-xl border bg-inset px-4 py-2.5 text-sm text-ink
          outline-none transition placeholder:text-ink-faint
          ${isPassword ? "pr-11" : ""}

          ${
            error
              ? "border-rose-line focus:border-rose-dot focus:bg-rose-soft"
              : "border-line focus:border-indigo-dot focus:bg-surface-hover"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-ink-faint transition hover:text-ink"
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            tabIndex={-1}
          >
            {revealed ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>

      {/* The hint keeps long guidance out of the label, where it would wrap
          and knock a two-column row out of alignment. */}
      {error ? (
        <p className="text-xs text-rose-fg">
          {error.message}
        </p>
      ) : (
        hint && <p className="text-[12.54px] text-ink-faint">{hint}</p>
      )}
    </div>
  );
}
