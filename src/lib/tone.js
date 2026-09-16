// A figure that can go either way — a day's extra save, a week's saving, a
// plan's net profit — is emerald at or above zero and rose below it. Spending
// past a budget is a real loss, not a smaller saving, so it must not share the
// saving's colour. Every signed chip reads its colours from here.
export const signTone = (value) =>
  Number(value) < 0
    ? "bg-rose-soft text-rose-fg ring-rose-line"
    : "bg-emerald-soft text-emerald-fg ring-emerald-line";

// The same figure with its sign always shown, so "+24.23" and "-30.77" line up
// as a gain and a loss rather than a number and a negative one.
export const signed = (value) => {
  const number = Number(value);

  return `${number >= 0 ? "+" : ""}${number.toFixed(2)}`;
};
