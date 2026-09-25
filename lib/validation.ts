import type { FieldResult, TenureUnit } from "@/types/calculator";
import { formatCurrency } from "@/lib/format";

export const MAX_AMOUNT = 1_00_00_00_00_000; // ₹1 lakh crore
export const MAX_TENURE_MONTHS = 600; // 50 years

/** Parses a raw field value (grouping commas allowed). Returns null if not a plain non-negative number. */
export function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/,/g, "").trim();
  if (cleaned === "" || cleaned === "." || !/^\d*\.?\d*$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

/** Money must be numeric, greater than zero and within a sane upper bound. */
export function validateAmount(raw: string, fieldName: string): FieldResult {
  const value = parseNumber(raw);
  if (value === null || value <= 0) {
    return { ok: false, error: `Please enter a valid ${fieldName}.` };
  }
  if (value > MAX_AMOUNT) {
    return { ok: false, error: `The ${fieldName} cannot exceed ${formatCurrency(MAX_AMOUNT)}.` };
  }
  return { ok: true, value };
}

/** Interest rate must be between 0 and 100 (inclusive). */
export function validateRate(raw: string): FieldResult {
  const value = parseNumber(raw);
  if (value === null || value < 0 || value > 100) {
    return { ok: false, error: "Please enter a valid interest rate between 0% and 100%." };
  }
  return { ok: true, value };
}

/** Tenure must be a whole number greater than zero; the result is in months. */
export function validateTenure(raw: string, unit: TenureUnit): FieldResult {
  const value = parseNumber(raw);
  if (value === null || value <= 0 || !Number.isInteger(value)) {
    return { ok: false, error: `Please enter a valid tenure in whole ${unit}.` };
  }
  const months = unit === "years" ? value * 12 : value;
  if (months > MAX_TENURE_MONTHS) {
    return { ok: false, error: "Tenure cannot exceed 50 years (600 months)." };
  }
  return { ok: true, value: months };
}
