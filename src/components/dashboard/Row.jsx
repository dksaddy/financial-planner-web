export default function Row({
  label,
  value,
  prefix = "",
  suffix = "",
}) {
  const numericValue = Number(value ?? 0);

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium text-gray-900">
        {prefix}
        {numericValue.toFixed(2)}
        {suffix}
      </span>
    </div>
  );
}