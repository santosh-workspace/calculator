import type { FDInput, FDResult } from "@/types/calculator";
import { periodsPerYear } from "@/lib/compounding";

/**
 * Cumulative fixed deposit maturity.
 *
 *   A = P × (1 + r/n)^(n × t)
 *
 * P = principal, r = annual rate as a decimal, n = compounding periods per year,
 * t = tenure in years (tenureMonths / 12, so partial periods compound
 * fractionally).
 *
 * Effective annual yield = (1 + r/n)^n − 1, i.e. the equivalent once-a-year rate.
 */
export function calculateFD({ principal, annualRate, tenureMonths, compounding }: FDInput): FDResult | null {
  if (!(principal > 0) || !(annualRate >= 0) || !(tenureMonths > 0)) return null;

  const r = annualRate / 100;
  const n = periodsPerYear(compounding);
  const t = tenureMonths / 12;

  const maturityAmount = principal * Math.pow(1 + r / n, n * t);
  const interestEarned = maturityAmount - principal;
  const effectiveAnnualYield = (Math.pow(1 + r / n, n) - 1) * 100;

  if (![maturityAmount, interestEarned, effectiveAnnualYield].every(Number.isFinite)) return null;

  return { principal, maturityAmount, interestEarned, tenureMonths, effectiveAnnualYield };
}
