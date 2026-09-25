"use client";

import { useState } from "react";
import type { TenureUnit } from "@/types/calculator";
import { calculateLoan } from "@/lib/loan-calculator";
import { formatCurrency, formatPercent, formatTenure, reconcileForDisplay } from "@/lib/format";
import { validateAmount, validateRate, validateTenure } from "@/lib/validation";
import { CalculatorInput, UnitSelect } from "@/components/CalculatorInput";
import { InputCard } from "@/components/InputCard";
import { ResultCard } from "@/components/ResultCard";
import { TENURE_UNIT_OPTIONS } from "@/components/options";

export function LoanCalculator() {
  const [amount, setAmount] = useState("1,00,000");
  const [rate, setRate] = useState("10");
  const [tenure, setTenure] = useState("5");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");

  const amountField = validateAmount(amount, "loan amount");
  const rateField = validateRate(rate);
  const tenureField = validateTenure(tenure, tenureUnit);

  const result =
    amountField.ok && rateField.ok && tenureField.ok
      ? calculateLoan({ principal: amountField.value, annualRate: rateField.value, tenureMonths: tenureField.value })
      : null;

  const display = result ? reconcileForDisplay(result.principal, result.totalPayment) : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
      <InputCard title="Loan Details" subtitle="Enter your loan details to calculate EMI and total interest.">
        <CalculatorInput
          id="loan-amount"
          label="Loan Amount"
          kind="amount"
          prefix="₹"
          value={amount}
          onChange={setAmount}
          error={amountField.ok ? undefined : amountField.error}
        />
        <CalculatorInput
          id="loan-rate"
          label="Annual Interest Rate"
          kind="rate"
          suffix="%"
          value={rate}
          onChange={setRate}
          error={rateField.ok ? undefined : rateField.error}
        />
        <CalculatorInput
          id="loan-tenure"
          label="Loan Tenure"
          kind="integer"
          value={tenure}
          onChange={setTenure}
          error={tenureField.ok ? undefined : tenureField.error}
          trailing={
            <UnitSelect
              id="loan-tenure-unit"
              label="Loan tenure unit"
              value={tenureUnit}
              options={TENURE_UNIT_OPTIONS}
              onChange={setTenureUnit}
            />
          }
        />
      </InputCard>

      <ResultCard
        title="Your Loan Summary"
        primaryLabel="Monthly EMI"
        primaryValue={result ? formatCurrency(result.monthlyEmi) : null}
        primaryCaption={
          result ? `${formatTenure(result.tenureMonths)} at ${formatPercent(rateField.ok ? rateField.value : 0, 2)} p.a.` : undefined
        }
        metrics={
          display
            ? [
                { label: "Total Interest", value: formatCurrency(display.extra), accent: "secondary" },
                { label: "Total Amount Payable", value: formatCurrency(display.total) },
                { label: "Principal Amount", value: formatCurrency(display.base), accent: "primary" },
              ]
            : []
        }
        breakdownTitle="Payment Breakdown"
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
