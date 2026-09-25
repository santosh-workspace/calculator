import { FinanceCalculator } from "@/components/FinanceCalculator";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:text-left">
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-6">
              <rect x="4.5" y="2.75" width="15" height="18.5" rx="2.5" />
              <rect x="7.5" y="5.75" width="9" height="3.5" rx="0.75" />
              <path strokeLinecap="round" d="M8.25 13h.01M12 13h.01M15.75 13h.01M8.25 17h.01M12 17h.01M15.75 17h.01" strokeWidth={2.4} />
            </svg>
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Smart Finance Calculator</h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Loan EMI, fixed deposit maturity, and recurring deposit returns in one place.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-8 pb-10 sm:px-6 sm:pt-10 lg:px-8">
        <FinanceCalculator />
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 pb-10 text-center sm:px-6">
        <p className="text-xs leading-relaxed text-slate-500">
          Calculations are estimates for informational purposes. Actual bank or financial-institution returns may vary
          based on their applicable rates, compounding conventions, taxes, and terms.
        </p>
      </footer>
    </div>
  );
}
