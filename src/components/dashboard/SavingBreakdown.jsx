import { FiLayers } from "react-icons/fi";

import Section from "./Section";
import Row from "./Row";

export default function SavingBreakdown({ saving }) {
  return (
    <Section
      title="Saving Breakdown"
      icon={FiLayers}
      accent="cyan"
    >
      <div className="space-y-1">
        <Row
          label="Weekly Saving"
          value={saving.weeklySaving}
          accent="cyan"
        />

        <Row
          label="Monthly Saving"
          value={saving.monthlySaving}
          accent="cyan"
        />

        <div className="mt-2 border-t border-line pt-2">
          <Row
            label="Total Saving"
            value={saving.totalMonthlySaving}
            accent="cyan"
            emphasis
          />
        </div>
      </div>
    </Section>
  );
}
