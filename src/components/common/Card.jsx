export default function Card({
  title,
  children,
}) {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      {title && (
        <h2 className="mb-6 text-center text-2xl font-bold">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}