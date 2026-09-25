import type { LoanInput, LoanResult } from "@/types/calculator";

/**
 * Reducing-balance EMI.
 *
 *   EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
 *
 * P = principal, r = monthly rate (annualRate / 12 / 100), n = number of months.
 * A zero rate is handled explicitly as EMI = P / n.
 *
 * All values are kept at full floating-point precision; rounding happens only
 * when a value is displayed. Returns null for inputs that cannot produce a
 * meaningful result.
 */
export function calculateLoan({ principal, annualRate, tenureMonths }: LoanInput): LoanResult | null {
  if (!(principal > 0) || !(annualRate >= 0) || !(tenureMonths > 0)) return null;

  const n = tenureMonths;
  const r = annualRate / 12 / 100;

  let monthlyEmi: number;
  if (r === 0) {
    monthlyEmi = principal / n;
  } else {
    // (1 + r)^n − 1 computed via expm1/log1p to stay accurate for very small rates.
    const growthMinusOne = Math.expm1(n * Math.log1p(r));
    const growth = growthMinusOne + 1;
    monthlyEmi = (principal * r * growth) / growthMinusOne;
  }

  const totalPayment = monthlyEmi * n;
  const totalInterest = totalPayment - principal;

  if (![monthlyEmi, totalPayment, totalInterest].every(Number.isFinite)) return null;

  return { principal, monthlyEmi, totalInterest, totalPayment, tenureMonths: n };
}
