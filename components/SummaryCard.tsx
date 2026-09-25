import type { SummaryMetric } from "@/types/calculator";

const ACCENT_CLASS = {
  primary: "bg-blue-600",
  secondary: "bg-emerald-500",
} as const;

/** Supporting metric tile shown under the primary result. */
export function SummaryCard({ label, value, accent }: SummaryMetric) {
  return (
    <div className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4">
      <dt className="flex items-center gap-2 text-sm text-slate-600">
        {accent && <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${ACCENT_CLASS[accent]}`} />}
        {label}
      </dt>
      <dd className="mt-1.5 text-xl font-bold tabular-nums tracking-tight text-slate-900 [overflow-wrap:anywhere]">
        {value}
      </dd>
    </div>
  );
}
