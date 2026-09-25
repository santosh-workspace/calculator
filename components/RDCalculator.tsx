"use client";

import { useState } from "react";
import type { CompoundingFrequency, TenureUnit } from "@/types/calculator";
import { calculateRD } from "@/lib/rd-calculator";
import { COMPOUNDING_OPTIONS } from "@/lib/compounding";
import { formatCurrency, formatTenure, reconcileForDisplay } from "@/lib/format";
import { validateAmount, validateRate, validateTenure } from "@/lib/validation";
import { CalculatorInput, CalculatorSelect, UnitSelect } from "@/components/CalculatorInput";
import { InputCard } from "@/components/InputCard";
import { ResultCard } from "@/components/ResultCard";
import { TENURE_UNIT_OPTIONS } from "@/components/options";

export function RDCalculator() {
  const [amount, setAmount] = useState("5,000");
  const [rate, setRate] = useState("7");
  const [tenure, setTenure] = useState("2");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");
  const [compounding, setCompounding] = useState<CompoundingFrequency>("quarterly");

  const amountField = validateAmount(amount, "monthly deposit");
  const rateField = validateRate(rate);
  const tenureField = validateTenure(tenure, tenureUnit);

  const result =
    amountField.ok && rateField.ok && tenureField.ok
      ? calculateRD({
          monthlyDeposit: amountField.value,
          annualRate: rateField.value,
          tenureMonths: tenureField.value,
          compounding,
        })
      : null;

  const display = result ? reconcileForDisplay(result.totalDeposits, result.maturityAmount) : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
      <InputCard
        title="Recurring Deposit Details"
        subtitle="Enter your monthly deposit details to calculate maturity amount."
      >
        <CalculatorInput
          id="rd-amount"
          label="Monthly Deposit"
          kind="amount"
          prefix="₹"
          value={amount}
          onChange={setAmount}
          error={amountField.ok ? undefined : amountField.error}
        />
        <CalculatorInput
          id="rd-rate"
          label="Annual Interest Rate"
          kind="rate"
          suffix="%"
          value={rate}
          onChange={setRate}
          error={rateField.ok ? undefined : rateField.error}
        />
        <CalculatorInput
          id="rd-tenure"
          label="Tenure"
          kind="integer"
          value={tenure}
          onChange={setTenure}
          error={tenureField.ok ? undefined : tenureField.error}
          trailing={
            <UnitSelect
              id="rd-tenure-unit"
              label="Deposit tenure unit"
              value={tenureUnit}
              options={TENURE_UNIT_OPTIONS}
              onChange={setTenureUnit}
            />
          }
        />
        <CalculatorSelect
          id="rd-compounding"
          label="Compounding Frequency"
          value={compounding}
          options={COMPOUNDING_OPTIONS}
          onChange={setCompounding}
          hint="Most Indian banks compound recurring deposits quarterly."
        />
      </InputCard>

      <ResultCard
        title="Your RD Summary"
        primaryLabel="Maturity Amount"
        primaryValue={display ? formatCurrency(display.total) : null}
        primaryCaption={
          result
            ? `${result.tenureMonths} monthly deposits of ${formatCurrency(result.monthlyDeposit)} over ${formatTenure(result.tenureMonths)}`
            : undefined
        }
        metrics={
          display
            ? [
                { label: "Interest Earned", value: formatCurrency(display.extra), accent: "secondary" },
                { label: "Total Deposits", value: formatCurrency(display.base), accent: "primary" },
              ]
            : []
        }
        breakdownTitle="Deposit Breakdown"
        breakdown={
          display
            ? {
                primary: { label: "Total Deposits", value: display.base },
                secondary: { label: "Interest", value: display.extra },
              }
            : null
        }
      />
    </div>
  );
}
