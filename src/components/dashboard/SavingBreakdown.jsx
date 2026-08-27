import Section from "./Section";
import Row from "./Row";

export default function SavingBreakdown({ saving }) {
  return (
    <Section title="Saving Breakdown">
      <div className="space-y-2 text-sm">
        <Row
          label="Weekly Saving"
          value={saving.weeklySaving}
        />

        <Row
          label="Monthly Saving"
          value={saving.monthlySaving}
        />

        <Row
          label="Total Monthly Saving"
          value={saving.totalMonthlySaving}
        />
      </div>
    </Section>
  );
}