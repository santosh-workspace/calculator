"use client";

import { useEffect, useState } from "react";
import type { BreakdownPart, SummaryMetric } from "@/types/calculator";
import { BreakdownChart } from "@/components/BreakdownChart";
import { SummaryCard } from "@/components/SummaryCard";

type ResultCardProps = {
  title: string;
  primaryLabel: string;
  /** Formatted primary value, or null when inputs are invalid. */
  primaryValue: string | null;
  primaryCaption?: string;
  metrics: SummaryMetric[];
  breakdownTitle: string;
  breakdown: { primary: BreakdownPart; secondary: BreakdownPart } | null;
};

const ANNOUNCE_DELAY_MS = 800;

export function ResultCard({
  title,
  primaryLabel,
  primaryValue,
  primaryCaption,
  metrics,
  breakdownTitle,
  breakdown,
}: ResultCardProps) {
  const isValid = primaryValue !== null;

  // Screen-reader summary, updated only once the user pauses typing to avoid chatty announcements.
  const summary = isValid
    ? `${primaryLabel} ${primaryValue}. ${metrics.map((m) => `${m.label} ${m.value}`).join(". ")}.`
    : "Results unavailable. Please correct the highlighted fields.";
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setAnnouncement(summary), ANNOUNCE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [summary]);

  const titleId = `${title.replace(/\W+/g, "-").toLowerCase()}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-7"
    >
      <h2 id={titleId} className="text-lg font-semibold text-slate-900 sm:text-xl">
        {title}
      </h2>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="mt-5 rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-blue-50/40 px-5 py-7 text-center sm:py-9">
        <p className="text-sm font-medium tracking-wide text-blue-800 uppercase">{primaryLabel}</p>
        <p
          key={primaryValue ?? "invalid"}
          className="result-value mt-2 text-4xl font-bold tabular-nums tracking-tight text-slate-900 [overflow-wrap:anywhere] sm:text-5xl"
        >
          {primaryValue ?? "—"}
        </p>
        {isValid && primaryCaption && <p className="mt-2 text-sm text-slate-600">{primaryCaption}</p>}
        {!isValid && (
          <p className="mt-2 text-sm text-slate-600">Correct the highlighted details to see your results.</p>
        )}
      </div>

      {isValid && (
        <>
          <dl className={`mt-4 grid gap-3 ${metrics.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {metrics.map((metric) => (
              <SummaryCard key={metric.label} {...metric} />
            ))}
          </dl>
          {breakdown && <BreakdownChart title={breakdownTitle} {...breakdown} />}
        </>
      )}
    </section>
  );
}
