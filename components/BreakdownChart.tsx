import { useId } from "react";
import type { BreakdownPart } from "@/types/calculator";
import { formatCurrency, formatPercent } from "@/lib/format";

type BreakdownChartProps = {
  title: string;
  /** Main amount (principal / deposits), drawn in the primary blue. */
  primary: BreakdownPart;
  /** Secondary amount (interest), drawn in the green accent. */
  secondary: BreakdownPart;
};

/** Horizontal two-part stacked bar with a labelled legend (values never conveyed by colour alone). */
export function BreakdownChart({ title, primary, secondary }: BreakdownChartProps) {
  const headingId = useId();
  const total = primary.value + secondary.value;
  const rawPrimaryShare = total > 0 ? (primary.value / total) * 100 : 100;
  // Round once and derive the other share so the two percentages always add up to 100.
  const primaryShare = Math.round(rawPrimaryShare * 10) / 10;
  const secondaryShare = Math.round((100 - primaryShare) * 10) / 10;

  const description = `${primary.label} ${formatPercent(primaryShare)} (${formatCurrency(primary.value)}), ${
    secondary.label
  } ${formatPercent(secondaryShare)} (${formatCurrency(secondary.value)})`;

  const legend = [
    { part: primary, share: primaryShare, swatch: "bg-blue-600" },
    { part: secondary, share: secondaryShare, swatch: "bg-emerald-500" },
  ];

  return (
    <section aria-labelledby={headingId} className="mt-6">
      <h3 id={headingId} className="text-sm font-semibold text-slate-900">
        {title}
      </h3>
      <div
        role="img"
        aria-label={`${title}: ${description}`}
        className="mt-3 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100"
      >
        <div className="bar-segment h-full bg-blue-600" style={{ width: `${rawPrimaryShare}%` }} />
        <div
          className="bar-segment h-full bg-emerald-500"
          style={{ width: `${100 - rawPrimaryShare}%`, marginLeft: rawPrimaryShare > 0 && rawPrimaryShare < 100 ? 2 : 0 }}
        />
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2" aria-hidden="true">
        {legend.map(({ part, share, swatch }) => (
          <li key={part.label} className="flex min-w-0 items-start gap-2.5">
            <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${swatch}`} />
            <div className="min-w-0">
              <p className="text-sm text-slate-600">
                {part.label} <span className="font-semibold text-slate-900">{formatPercent(share)}</span>
              </p>
              <p className="text-base font-semibold tabular-nums text-slate-900 [overflow-wrap:anywhere]">
                {formatCurrency(part.value)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
