import { FiTrendingDown } from "react-icons/fi";

import Section from "./Section";
import Row from "./Row";

// Names the working days behind a figure when the API sent them.
const withDays = (label, days, operator) =>
  days ? `${label} (${operator} ${days} days)` : label;

export default function SpendingCard({ spending }) {
  return (
    <Section
      title="Spending"
      icon={FiTrendingDown}
      accent="amber"
    >
      <div className="space-y-1">
        <div className="mb-2 border-b border-line pb-2">
          <Row
            label="Monthly"
            value={spending.monthly}
            accent="amber"
            emphasis
          />
        </div>

        <Row
          label={withDays("Weekly", spending.workingDaysPerWeek, "×")}
          value={spending.weekly}
          accent="amber"
        />

        <Row
          label={withDays("Daily", spending.workingDaysPerMonth, "÷")}
          value={spending.daily}
          accent="amber"
        />
      </div>
    </Section>
  );
}
