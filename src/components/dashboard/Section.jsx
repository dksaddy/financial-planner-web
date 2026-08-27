export default function Section({
  title,
  actions,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-xl bg-white p-4 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          {title}
        </h2>

        {actions}
      </div>

      {children}
    </section>
  );
}