const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const groupingFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Formats rupees with Indian digit grouping, e.g. 12500000 → "₹1,25,00,000". */
export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value);
  // Avoid "-₹0" for tiny negative floating-point residue.
  return currencyFormatter.format(rounded === 0 ? 0 : rounded);
}

/** Formats a percentage with up to `digits` decimals, e.g. 7.1859 → "7.19%". */
export function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: digits }).format(value)}%`;
}

/** "60 months" → "5 years", "18 months" → "1 year 6 months". */
export function formatTenure(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (rest > 0) parts.push(`${rest} ${rest === 1 ? "month" : "months"}`);
  return parts.join(" ");
}

/**
 * Rounds a base amount and a total for display so that the two parts always add
 * up: the displayed "extra" (interest) is derived from the displayed values
 * instead of being rounded independently.
 */
export function reconcileForDisplay(base: number, total: number) {
  const roundedBase = Math.round(base);
  const roundedTotal = Math.round(total);
  return { base: roundedBase, extra: roundedTotal - roundedBase, total: roundedTotal };
}

/**
 * Formats what the user is typing into an amount field: Indian grouping for the
 * integer part, the decimal part left exactly as typed.
 * "100000" → "1,00,000", "1234.5" → "1,234.5".
 */
export function formatAmountInput(raw: string): string {
  if (raw === "") return "";
  const [intPart, decPart] = raw.split(".");
  const intDigits = intPart.replace(/^0+(?=\d)/, "");
  const groupedInt = intDigits === "" ? "" : groupingFormatter.format(Number(intDigits));
  return decPart === undefined ? groupedInt : `${groupedInt || "0"}.${decPart}`;
}
