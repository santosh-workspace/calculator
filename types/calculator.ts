export type CalculatorType = "loan" | "fd" | "rd";

export type TenureUnit = "years" | "months";

export type CompoundingFrequency = "monthly" | "quarterly" | "half-yearly" | "yearly";

export type LoanInput = {
  /** Principal loan amount in rupees. */
  principal: number;
  /** Annual interest rate in percent, e.g. 10 for 10%. */
  annualRate: number;
  /** Number of monthly instalments. */
  tenureMonths: number;
};

export type LoanResult = {
  principal: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  tenureMonths: number;
};

export type FDInput = {
  principal: number;
  annualRate: number;
  tenureMonths: number;
  compounding: CompoundingFrequency;
};

export type FDResult = {
  principal: number;
  maturityAmount: number;
  interestEarned: number;
  tenureMonths: number;
  /** Effective annual yield in percent for the chosen compounding frequency. */
  effectiveAnnualYield: number;
};

export type RDInput = {
  monthlyDeposit: number;
  annualRate: number;
  tenureMonths: number;
  compounding: CompoundingFrequency;
};

export type RDResult = {
  monthlyDeposit: number;
  totalDeposits: number;
  maturityAmount: number;
  interestEarned: number;
  tenureMonths: number;
};

/** Outcome of validating a single raw form field. */
export type FieldResult = { ok: true; value: number } | { ok: false; error: string };

export type BreakdownPart = {
  label: string;
  value: number;
};

export type SummaryMetric = {
  label: string;
  value: string;
  /** Marks the metric with the matching breakdown colour swatch. */
  accent?: "primary" | "secondary";
};
