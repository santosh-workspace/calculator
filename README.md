# Smart Finance Calculator

Loan EMI, fixed deposit maturity, and recurring deposit returns in one place.

A client-side Next.js (App Router) app with TypeScript and Tailwind CSS. It has no backend, no API calls and no runtime dependencies beyond Next/React, so it works offline once loaded.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Type-check only: `npm run typecheck`.

## Project structure

```text
app/
  layout.tsx            Metadata (title, description, Open Graph), viewport
  page.tsx              Header, calculator, disclaimer
  globals.css           Tailwind import, theme tokens, subtle animations, reduced-motion
components/
  FinanceCalculator.tsx Tab state; keeps all three panels mounted so inputs persist
  CalculatorTabs.tsx    Accessible tablist (arrow keys, Home/End, roving tabindex)
  LoanCalculator.tsx    Loan form + results
  FDCalculator.tsx      FD form + results
  RDCalculator.tsx      RD form + results
  CalculatorInput.tsx   Text input with ₹ prefix / % suffix, live Indian grouping, unit & frequency selects
  InputCard.tsx         Input card shell
  ResultCard.tsx        Primary result, metric tiles, breakdown, debounced aria-live summary
  SummaryCard.tsx       Supporting metric tile
  BreakdownChart.tsx    CSS stacked bar + legend
  options.ts            Tenure unit options
lib/
  loan-calculator.ts    calculateLoan()   (pure)
  fd-calculator.ts      calculateFD()     (pure)
  rd-calculator.ts      calculateRD()     (pure)
  compounding.ts        Compounding options and periods per year
  validation.ts         Field parsing and validation messages
  format.ts             formatCurrency(), percent/tenure formatting, display reconciliation
types/
  calculator.ts         Input and result types
```

The calculation functions are pure. They know nothing about React, and they return `null` rather than `NaN`/`Infinity` for inputs they can't handle. The UI validates fields first and only calls them with valid numbers.

## Formulas

All maths runs at full floating-point precision. Only displayed values are rounded, to whole rupees. The breakdown shows interest as `round(total) − round(principal)`, so the displayed parts always add up to the displayed total.

### Loan EMI (reducing balance)

```text
EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
r   = annualRate / 12 / 100        n = tenure in months
Total Payment  = EMI × n
Total Interest = Total Payment − P
```

A zero rate uses `EMI = P / n`. `(1 + r)^n − 1` is computed with `expm1(n·log1p(r))` so it stays accurate at very small rates.

### Fixed deposit (cumulative)

```text
A = P × (1 + r/n)^(n × t)
r = annual rate (decimal)   n = compounding periods per year (12/4/2/1)   t = months / 12
Interest Earned        = A − P
Effective Annual Yield = (1 + r/n)^n − 1
```

### Recurring deposit

This follows the convention Indian banks use. Each instalment `R` is paid at the start of its month and compounds at the selected frequency `f` for as long as it stays deposited. Fractional compounding periods compound fractionally:

```text
M = Σ_{m=1..N} R × (1 + r/f)^(f × m / 12)
```

With the equivalent monthly growth factor `g = (1 + r/f)^(f/12)`, this geometric series has a closed form:

```text
M = R × g × (g^N − 1) / (g − 1)
Total Deposits  = R × N
Interest Earned = M − Total Deposits
```

For monthly compounding, `g = 1 + i` with `i = r/12`. That gives the standard annuity formula `R × ((1 + i)^N − 1) / i` multiplied by `(1 + i)`, because each instalment is deposited at the start of the month. Quarterly, half-yearly and yearly compounding each give a different `g`, so the selected frequency really does change the result. At zero interest, `M = R × N`.

## Reference results (default inputs)

| Calculator | Inputs | Result |
|---|---|---|
| Loan | ₹1,00,000 · 10% · 5 years | EMI ₹2,125 (2,124.70) · Interest ₹27,482 · Total ₹1,27,482 · 78.4% / 21.6% |
| FD | ₹1,00,000 · 7% · 2 years · quarterly | Maturity ₹1,14,888 · Interest ₹14,888 · Effective yield 7.19% |
| RD | ₹5,000/month · 7% · 2 years · quarterly | Maturity ₹1,29,099 · Interest ₹9,099 · Deposits ₹1,20,000 |

## Validation

- **Amounts**: must be numeric, greater than 0 and at most ₹1,00,00,00,00,000. Up to 2 decimals are allowed.
- **Interest rate**: 0 to 100, up to 2 decimals.
- **Tenure**: a whole number greater than 0, at most 50 years (600 months).

When a field is invalid, it shows an inline message linked through `aria-describedby` and `aria-invalid`. The results area shows a placeholder instead of values, and the rest of the UI stays in place.
