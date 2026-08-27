export default function Section({
  title,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-xl bg-white p-4 shadow-sm ${className}`}
    >
      <h2 className="mb-4 text-sm font-semibold text-gray-900">
        {title}
      </h2>

      {children}
    </section>
  );
}