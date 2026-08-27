import Section from "./Section";

const WEEK_LABELS = {
  week1: "1 Week Ago",
  week2: "2 Weeks Ago",
  week3: "3 Weeks Ago",
  week4: "4 Weeks Ago",
};

export default function LastFourWeeksExpense({
  lastFourWeeks = {},
}) {
  return (
    <Section title="Last Four Weekly Expense">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(WEEK_LABELS).map(
          ([weekKey, label]) => {
            const items =
              lastFourWeeks[weekKey] || [];

            const total = items.reduce(
              (sum, item) =>
                sum + Number(item.total || 0),
              0
            );

            return (
              <div
                key={weekKey}
                className="rounded-lg border border-gray-200 p-3 text-sm"
              >
                <p className="font-medium text-gray-800">
                  {label}
                </p>

                <p className="text-xs text-gray-500">
                  {items.length} records
                </p>

                <p className="text-xs text-gray-500">
                  {total.toFixed(2)}
                </p>
              </div>
            );
          }
        )}
      </div>
    </Section>
  );
}