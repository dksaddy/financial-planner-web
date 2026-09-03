import { FiTrendingUp } from "react-icons/fi";

import Section from "./Section";
import Row from "./Row";

export default function SavingSummary({ saving }) {
  return (
    <Section
      title="Saving Summary"
      icon={FiTrendingUp}
      accent="emerald"
    >
      <div className="space-y-1">
        <Row
          label="Total Deposit"
          value={saving.totalDeposit}
          accent="emerald"
        />

        <Row
          label="Total Withdrawal"
          value={saving.totalWithdrawal}
          accent="rose"
        />

        <div className="mt-2 border-t border-line pt-2">
          <Row
            label="Profit"
            value={saving.profit}
            accent="emerald"
            emphasis
          />
        </div>
      </div>
    </Section>
  );
}
