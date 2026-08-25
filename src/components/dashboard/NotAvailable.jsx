export default function NotAvailable({ label = "Not available" }) {
  return (
    <div className="flex h-full min-h-[80px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  );
}