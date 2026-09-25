"use client";

import { useRef, type KeyboardEvent } from "react";
import type { CalculatorType } from "@/types/calculator";

export const CALCULATOR_TABS: { id: CalculatorType; label: string; description: string }[] = [
  { id: "loan", label: "Loan", description: "EMI" },
  { id: "fd", label: "FD", description: "Fixed Deposit" },
  { id: "rd", label: "RD", description: "Recurring Deposit" },
];

export const tabId = (id: CalculatorType) => `tab-${id}`;
export const panelId = (id: CalculatorType) => `panel-${id}`;

type CalculatorTabsProps = {
  active: CalculatorType;
  onChange: (id: CalculatorType) => void;
};

/** WAI-ARIA tabs with automatic activation, roving tabindex, and arrow/Home/End keys. */
export function CalculatorTabs({ active, onChange }: CalculatorTabsProps) {
  const tabRefs = useRef<Partial<Record<CalculatorType, HTMLButtonElement | null>>>({});

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = CALCULATOR_TABS.findIndex((tab) => tab.id === active);
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % CALCULATOR_TABS.length;
        break;
      case "ArrowLeft":
        next = (index - 1 + CALCULATOR_TABS.length) % CALCULATOR_TABS.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = CALCULATOR_TABS.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const nextId = CALCULATOR_TABS[next].id;
    onChange(nextId);
    tabRefs.current[nextId]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Choose a calculator"
      className="mx-auto grid w-full max-w-md grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm"
    >
      {CALCULATOR_TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={tabId(tab.id)}
            aria-selected={selected}
            aria-controls={panelId(tab.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={handleKeyDown}
            className={`flex min-w-0 flex-col items-center rounded-xl px-2 py-2.5 transition-colors duration-200 outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
              selected ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span className="text-base font-semibold">{tab.label}</span>
            <span className={`hidden text-xs sm:block ${selected ? "text-blue-100" : "text-slate-500"}`}>
              {tab.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
