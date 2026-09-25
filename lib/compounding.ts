import type { CompoundingFrequency } from "@/types/calculator";

export const COMPOUNDING_OPTIONS: { value: CompoundingFrequency; label: string }[] = [
  { value: "quarterly", label: "Quarterly" },
  { value: "monthly", label: "Monthly" },
  { value: "half-yearly", label: "Half-yearly" },
  { value: "yearly", label: "Yearly" },
];

const PERIODS_PER_YEAR: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  "half-yearly": 2,
  yearly: 1,
};

export function periodsPerYear(frequency: CompoundingFrequency): number {
  return PERIODS_PER_YEAR[frequency];
}
