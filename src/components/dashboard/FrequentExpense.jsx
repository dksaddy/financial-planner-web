import Section from "./Section";

export default function FrequentExpense({
  expenses = [],
}) {
  const slots = [
    ...expenses,
    ...Array(
      Math.max(0, 4 - expenses.length)
    ).fill(null),
  ].slice(0, 4);

  return (
    <Section title="Frequently Expense Type">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {slots.map((expense, index) =>
          expense ? (
            <div
              key={expense.id}
              className="rounded-lg border border-gray-200 p-3 text-sm"
            >
              <p className="truncate font-medium text-gray-800">
                {expense.name}
              </p>

              <p className="text-xs text-gray-500">
                {expense.frequency}x
              </p>

              <p className="text-xs text-gray-500">
                {Number(expense.totalAmount).toFixed(2)}
              </p>
            </div>
          ) : (
            <div
              key={`empty-${index}`}
              className="flex min-h-[76px] items-center justify-center rounded-lg border border-dashed border-gray-200"
            >
              <span className="text-xs text-gray-300">
                N/A
              </span>
            </div>
          )
        )}
      </div>
    </Section>
  );
}