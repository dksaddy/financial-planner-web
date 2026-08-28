export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  register,
  error,
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full rounded-lg border px-4 py-2 outline-none transition bg-white text-gray-900

        ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-blue-500"
        }`}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}