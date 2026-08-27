import Section from "./Section";
import Row from "./Row";

export default function SavingSummary({ saving }) {
  return (
    <Section title="Saving Summary">
      <div className="space-y-2 text-sm">
        <Row
          label="Total Deposit"
          value={saving.totalDeposit}
        />

        <Row
          label="Total Withdrawal"
          value={saving.totalWithdrawal}
        />

        <Row
          label="Profit"
          value={saving.profit}
        />
      </div>
    </Section>
  );
}