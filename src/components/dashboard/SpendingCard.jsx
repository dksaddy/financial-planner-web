import { FiTrendingDown } from "react-icons/fi";

import Section from "./Section";
import Row from "./Row";

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
          label="Weekly"
          value={spending.weekly}
          accent="amber"
        />

        <Row
          label="Daily"
          value={spending.daily}
          accent="amber"
        />
      </div>
    </Section>
  );
}
