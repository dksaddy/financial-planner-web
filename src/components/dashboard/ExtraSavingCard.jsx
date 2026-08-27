import Section from "./Section";
import Row from "./Row";

export default function ExtraSavingCard({ extraSaving }) {
  return (
    <Section title="Total Extra Save">
      <div className="space-y-2 text-sm">
        <Row
          label="Extra Save"
          value={extraSaving.totalExtraSave}
        />

        <Row
          label="Daily Savings"
          value={extraSaving.totalFromDailySavings}
        />

        <Row
          label="Target Deduction"
          value={extraSaving.totalDeductedByTargets}
        />
      </div>
    </Section>
  );
}