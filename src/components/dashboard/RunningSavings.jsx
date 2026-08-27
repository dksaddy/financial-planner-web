import Section from "./Section";

const WEEK_LABELS = {
  week1: "1 Week Ago",
  week2: "2 Weeks Ago",
  week3: "3 Weeks Ago",
  week4: "4 Weeks Ago",
};

export default function RunningSavings({
  saving,
  lastFourWeeks = {},
}) {
  const weeklySaving = Number(
    saving?.weeklySaving || 0
  );

  return (
    <Section title="Running Savings">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(WEEK_LABELS).map(
          ([weekKey, label]) => {
            const expenses =
              lastFourWeeks[weekKey] || [];

            const expenseTotal = expenses.reduce(
              (sum, item) =>
                sum + Number(item.total || 0),
              0
            );

            /*
             * Keep this calculation simple because the
             * current API does not expose a separate
             * weekly saving value for each historical week.
             */
            const estimatedSaving = Math.max(
              weeklySaving - expenseTotal,
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

                <p className="mt-1 text-xs text-gray-500">
                  Expense
                </p>

                <p className="font-medium text-gray-800">
                  {expenseTotal.toFixed(2)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Saving
                </p>

                <p className="font-medium text-gray-800">
                  {estimatedSaving.toFixed(2)}
                </p>
              </div>
            );
          }
        )}
      </div>
    </Section>
  );
}