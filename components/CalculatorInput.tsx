"use client";

import { useLayoutEffect, useRef, type ChangeEvent, type ReactNode } from "react";
import { formatAmountInput } from "@/lib/format";

type InputKind = "amount" | "rate" | "integer";

const LIMITS: Record<InputKind, { maxInt: number; maxDecimals: number }> = {
  amount: { maxInt: 13, maxDecimals: 2 },
  rate: { maxInt: 3, maxDecimals: 2 },
  integer: { maxInt: 3, maxDecimals: 0 },
};

/** Keeps digits and (where allowed) one decimal point, within length limits. */
function sanitize(raw: string, kind: InputKind): string {
  const { maxInt, maxDecimals } = LIMITS[kind];
  const cleaned = raw.replace(maxDecimals > 0 ? /[^\d.]/g : /\D/g, "");
  const dot = cleaned.indexOf(".");
  if (dot === -1) return cleaned.slice(0, maxInt);
  const intPart = cleaned.slice(0, dot).slice(0, maxInt);
  const decPart = cleaned.slice(dot + 1).replace(/\./g, "").slice(0, maxDecimals);
  return `${intPart}.${decPart}`;
}

/** Position in `formatted` just after the `count`-th non-comma character. */
function caretFor(formatted: string, count: number): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] !== ",") seen++;
    if (seen === count) return i + 1;
  }
  return formatted.length;
}

type CalculatorInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  kind: InputKind;
  prefix?: string;
  suffix?: string;
  /** Extra control rendered inside the field on the right, e.g. a unit selector. */
  trailing?: ReactNode;
  error?: string;
  hint?: string;
};

export function CalculatorInput({
  id,
  label,
  value,
  onChange,
  kind,
  prefix,
  suffix,
  trailing,
  error,
  hint,
}: CalculatorInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  // Restore the caret after re-formatting so typing in the middle of "1,00,000" behaves naturally.
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input && pendingCaret.current !== null && document.activeElement === input) {
      input.setSelectionRange(pendingCaret.current, pendingCaret.current);
    }
    pendingCaret.current = null;
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    const caret = event.target.selectionStart ?? raw.length;
    const sanitized = sanitize(raw, kind);
    const next = kind === "amount" ? formatAmountInput(sanitized) : sanitized;
    const significantBeforeCaret = sanitize(raw.slice(0, caret), kind).replace(/,/g, "").length;
    pendingCaret.current = caretFor(next, significantBeforeCaret);
    onChange(next);
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div
        className={`field-shell flex min-w-0 items-stretch overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] duration-150 ${
          error
            ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100"
            : "border-slate-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
        }`}
      >
        {prefix && (
          <span
            aria-hidden="true"
            className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-500"
          >
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode={kind === "integer" ? "numeric" : "decimal"}
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={handleChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="h-13 w-full min-w-0 flex-1 bg-transparent px-4 text-lg font-semibold tabular-nums text-slate-900 outline-none placeholder:text-slate-400"
        />
        {suffix && (
          <span aria-hidden="true" className="flex items-center pr-4 text-base font-semibold text-slate-500">
            {suffix}
          </span>
        )}
        {trailing}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-4 shrink-0">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

type Option<T extends string> = { value: T; label: string };

const CHEVRON =
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2364748b'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z' clip-rule='evenodd'/%3E%3C/svg%3E\")] bg-[length:1.25rem] bg-no-repeat";

/** Compact unit selector meant to sit inside a CalculatorInput via `trailing`. */
export function UnitSelect<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <select
      id={id}
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className={`${CHEVRON} cursor-pointer appearance-none border-l border-slate-200 bg-slate-50 bg-[position:right_0.6rem_center] py-0 pr-9 pl-4 text-sm font-semibold text-slate-700 outline-none transition-colors hover:bg-slate-100 focus-visible:bg-blue-50 focus-visible:text-blue-800`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/** Full-width labelled select, e.g. compounding frequency. */
export function CalculatorSelect<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  hint?: string;
}) {
  const hintId = `${id}-hint`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        aria-describedby={hint ? hintId : undefined}
        className={`${CHEVRON} h-13 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white bg-[position:right_1rem_center] px-4 text-base font-semibold text-slate-900 outline-none transition-[border-color,box-shadow] duration-150 hover:border-slate-300 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}
