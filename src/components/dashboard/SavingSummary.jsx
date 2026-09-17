import { FiTrendingUp } from "react-icons/fi";

import Section from "./Section";
import Row from "./Row";

import { signTone } from "@/lib/tone";

export default function SavingSummary({ saving }) {
  return (
    <Section
      title="Saving Summary"
      icon={FiTrendingUp}
      accent="emerald"
      // Net profit rides the header rather than taking a row of its own: the
      // rows are the workings — deposit, withdrawal, the profit between them —
      // and this is what the card comes to. It takes its colour from its sign,
      // so a loss reads as one.
      //
      // It goes through `actions` — the header slot — and is then offset out of
      // the card's `p-5` into the top-right corner itself, which it fills: both
      // offsets are that same 1.25rem of padding, and `h-8` matches the header
      // icon it is centred against, so the two cancel exactly and the chip
      // lands on the card's own corner rather than near it. `relative` rather
      // than margins, so the header still reserves the space and the title
      // truncates against it instead of running underneath.
      //
      // Three of its corners are its own; the fourth is the card's, so it has
      // to be the card's `rounded-2xl` or the two would not meet.
      actions={
        <span
          title="Net profit after tax"
          className={`num relative -right-5 -top-5 flex h-8 items-center rounded-l-full rounded-br-xl rounded-tr-2xl px-3 text-[12.54px] font-bold ring-1 ring-inset ${signTone(
            saving.netProfit
          )}`}
        >
          {Number(saving.netProfit).toFixed(2)}
        </span>
      }
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

        {/* Before tax — the chip in the header is the same figure once each
            plan's own tax has been taken off it. */}
        <div className="mt-2 border-t border-line pt-2">
          <Row
            label="Profit"
            value={saving.profit}
            accent={Number(saving.profit) < 0 ? "rose" : "emerald"}
            emphasis
          />
        </div>
      </div>
    </Section>
  );
}
