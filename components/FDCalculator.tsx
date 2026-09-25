"use client";

import { useState } from "react";
import type { CompoundingFrequency, TenureUnit } from "@/types/calculator";
import { calculateFD } from "@/lib/fd-calculator";
import { COMPOUNDING_OPTIONS } from "@/lib/compounding";
import { formatCurrency, formatPercent, formatTenure, reconcileForDisplay } from "@/lib/format";
import { validateAmount, validateRate, validateTenure } from "@/lib/validation";
import { CalculatorInput, CalculatorSelect, UnitSelect } from "@/components/CalculatorInput";
import { InputCard } from "@/components/InputCard";
import { ResultCard } from "@/components/ResultCard";
import { TENURE_UNIT_OPTIONS } from "@/components/options";

export function FDCalculator() {
  const [amount, setAmount] = useState("1,00,000");
  const [rate, setRate] = useState("7");
  const [tenure, setTenure] = useState("2");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");
  const [compounding, setCompounding] = useState<CompoundingFrequency>("quarterly");

  const amountField = validateAmount(amount, "deposit amount");
  const rateField = validateRate(rate);
  const tenureField = validateTenure(tenure, tenureUnit);

  const result =
    amountField.ok && rateField.ok && tenureField.ok
      ? calculateFD({
          principal: amountField.value,
          annualRate: rateField.value,
          tenureMonths: tenureField.value,
          compounding,
        })
      : null;

  const display = result ? reconcileForDisplay(result.principal, result.maturityAmount) : null;
  const compoundingLabel = COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.label.toLowerCase();

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
      <InputCard title="Fixed Deposit Details" subtitle="Enter your deposit details to calculate maturity amount.">
        <CalculatorInput
          id="fd-amount"
          label="Deposit Amount"
          kind="amount"
          prefix="₹"
          value={amount}
          onChange={setAmount}
          error={amountField.ok ? undefined : amountField.error}
        />
        <CalculatorInput
          id="fd-rate"
          label="Annual Interest Rate"
          kind="rate"
          suffix="%"
          value={rate}
          onChange={setRate}
          error={rateField.ok ? undefined : rateField.error}
        />
        <CalculatorInput
          id="fd-tenure"
          label="Tenure"
          kind="integer"
          value={tenure}
          onChange={setTenure}
          error={tenureField.ok ? undefined : tenureField.error}
          trailing={
            <UnitSelect
              id="fd-tenure-unit"
              label="Deposit tenure unit"
              value={tenureUnit}
              options={TENURE_UNIT_OPTIONS}
              onChange={setTenureUnit}
            />
          }
        />
        <CalculatorSelect
          id="fd-compounding"
          label="Compounding Frequency"
          value={compounding}
          options={COMPOUNDING_OPTIONS}
          onChange={setCompounding}
          hint="Most Indian banks compound fixed deposits quarterly."
        />
      </InputCard>

      <ResultCard
        title="Your FD Summary"
        primaryLabel="Maturity Amount"
        primaryValue={display ? formatCurrency(display.total) : null}
        primaryCaption={
          result ? `After ${formatTenure(result.tenureMonths)}, compounded ${compoundingLabel}` : undefined
        }
        metrics={
          display && result
            ? [
                { label: "Interest Earned", value: formatCurrency(display.extra), accent: "secondary" },
                { label: "Principal Deposit", value: formatCurrency(display.base), accent: "primary" },
                { label: "Effective Annual Yield", value: formatPercent(result.effectiveAnnualYield, 2) },
              ]
            : []
        }
        breakdownTitle="Deposit Breakdown"
        breakdown={
          display
            ? {
                primary: { label: "Principal", value: display.base },
                secondary: { label: "Interest", value: display.extra },
              }
            : null
        }
      />
    </div>
  );
}
