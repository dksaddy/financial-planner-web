import Section from "./Section";
import Row from "./Row";

export default function OverviewCard({
  saving,
  spending,
  targets,
}) {
  return (
    <Section title="Overview">
      <div className="space-y-2 text-sm">
        <Row
          label="Salary"
          value={spending.salary}
        />

        <Row
          label="Monthly Spending"
          value={spending.monthly}
        />

        <Row
          label="Total Saving"
          value={saving.totalMonthlySaving}
        />

        <Row
          label="Pending Targets"
          value={targets.totalPendingTargets}
        />
      </div>
    </Section>
  );
}