import Section from "./Section";
import Row from "./Row";

export default function SpendingCard({ spending }) {
  return (
    <Section title="Spending">
      <div className="space-y-2 text-sm">
        <Row
          label="Monthly"
          value={spending.monthly}
        />

        <Row
          label="Weekly"
          value={spending.weekly}
        />

        <Row
          label="Daily"
          value={spending.daily}
        />
      </div>
    </Section>
  );
}