export default function NotAvailable({ label = "Not available" }) {
  return (
    <div className="flex h-full min-h-[80px] items-center justify-center rounded-xl border border-dashed border-line bg-inset">
      <span className="text-sm text-ink-faint">{label}</span>
    </div>
  );
}
