"use client";

import { useState, type ComponentType } from "react";
import type { CalculatorType } from "@/types/calculator";
import { CALCULATOR_TABS, CalculatorTabs, panelId, tabId } from "@/components/CalculatorTabs";
import { LoanCalculator } from "@/components/LoanCalculator";
import { FDCalculator } from "@/components/FDCalculator";
import { RDCalculator } from "@/components/RDCalculator";

const PANELS: Record<CalculatorType, ComponentType> = {
  loan: LoanCalculator,
  fd: FDCalculator,
  rd: RDCalculator,
};

export function FinanceCalculator() {
  const [active, setActive] = useState<CalculatorType>("loan");

  return (
    <div>
      <CalculatorTabs active={active} onChange={setActive} />
      <div className="mt-6 sm:mt-8">
        {/* All panels stay mounted so each calculator keeps its inputs when switching tabs. */}
        {CALCULATOR_TABS.map(({ id }) => {
          const Panel = PANELS[id];
          return (
            <div
              key={id}
              role="tabpanel"
              id={panelId(id)}
              aria-labelledby={tabId(id)}
              hidden={id !== active}
              className="tab-panel"
            >
              <Panel />
            </div>
          );
        })}
      </div>
    </div>
  );
}
