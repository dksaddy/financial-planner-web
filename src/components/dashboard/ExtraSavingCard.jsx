import { FiZap } from "react-icons/fi";

import Section from "./Section";
import Row from "./Row";

export default function ExtraSavingCard({ extraSaving }) {
  return (
    <Section
      title="Total Extra Save"
      icon={FiZap}
      accent="violet"
    >
      <div className="space-y-1">
        <div className="mb-2 border-b border-line pb-2">
          <Row
            label="Extra Save"
            value={extraSaving.totalExtraSave}
            accent="violet"
            emphasis
          />
        </div>

        <Row
          label="Daily Savings"
          value={extraSaving.totalFromDailySavings}
          accent="violet"
        />

        <Row
          label="Target Deduction"
          value={extraSaving.totalDeductedByTargets}
          accent="rose"
        />
      </div>
    </Section>
  );
}
