import type { RDInput, RDResult } from "@/types/calculator";
import { periodsPerYear } from "@/lib/compounding";

/**
 * Recurring deposit maturity.
 *
 * Convention (the one used by Indian banks, e.g. quarterly compounding for RDs):
 * each monthly instalment R is paid at the start of its month and earns
 * compound interest at the selected frequency for as long as it stays in the
 * account. The instalment paid in month k of N stays for (N − k + 1) months,
 * which is (N − k + 1) / 12 years, i.e. f × (N − k + 1) / 12 compounding
 * periods (fractional periods compound fractionally):
 *
 *   M = Σ_{m=1..N} R × (1 + r/f)^(f × m / 12)
 *
 * r = annual rate as a decimal, f = compounding periods per year.
 *
 * Let g = (1 + r/f)^(f/12) be the equivalent monthly growth factor. The sum is
 * a geometric series, giving the closed form used below:
 *
 *   M = R × g × (g^N − 1) / (g − 1)
 *
 * For monthly compounding g = 1 + i (i = r/12), so this is the standard
 * annuity formula R × ((1 + i)^N − 1) / i, multiplied by (1 + i) because each
 * instalment is deposited at the start of the month rather than the end.
 * For quarterly, half-yearly and yearly compounding g differs, so the chosen
 * frequency genuinely changes the result.
 *
 * Zero interest: M = R × N.
 */
export function calculateRD({ monthlyDeposit, annualRate, tenureMonths, compounding }: RDInput): RDResult | null {
  if (!(monthlyDeposit > 0) || !(annualRate >= 0) || !(tenureMonths > 0)) return null;

  const N = tenureMonths;
  const totalDeposits = monthlyDeposit * N;

  let maturityAmount: number;
  if (annualRate === 0) {
    maturityAmount = totalDeposits;
  } else {
    const r = annualRate / 100;
    const f = periodsPerYear(compounding);
    // ln(g) = (f / 12) × ln(1 + r/f); expm1 keeps (g − 1) and (g^N − 1) precise.
    const logG = (f / 12) * Math.log1p(r / f);
    const gMinusOne = Math.expm1(logG);
    const gPowNMinusOne = Math.expm1(N * logG);
    maturityAmount = (monthlyDeposit * (gMinusOne + 1) * gPowNMinusOne) / gMinusOne;
  }

  const interestEarned = maturityAmount - totalDeposits;

  if (![maturityAmount, interestEarned, totalDeposits].every(Number.isFinite)) return null;

  return { monthlyDeposit, totalDeposits, maturityAmount, interestEarned, tenureMonths: N };
}
