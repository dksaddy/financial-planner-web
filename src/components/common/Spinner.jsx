export default function Spinner({ size = 20 }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="relative"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full border-2 border-current opacity-25" />

      <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-current border-t-current" />
    </div>
  );
}
