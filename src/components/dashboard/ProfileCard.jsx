import Section from "./Section";

export default function ProfileCard({ user }) {
  return (
    <Section title="Profile">
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-400">Name</p>
          <p className="text-sm font-medium text-gray-800">
            {user?.name || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Email</p>
          <p className="truncate text-sm text-gray-700">
            {user?.email || "—"}
          </p>
        </div>
      </div>
    </Section>
  );
}