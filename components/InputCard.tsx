import type { ReactNode } from "react";

/** Card wrapper for a calculator's input form. */
export function InputCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const titleId = `${title.replace(/\W+/g, "-").toLowerCase()}-title`;
  return (
    <section
      aria-labelledby={titleId}
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-7"
    >
      <h2 id={titleId} className="text-lg font-semibold text-slate-900 sm:text-xl">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      <form className="mt-6 space-y-5" noValidate onSubmit={(event) => event.preventDefault()}>
        {children}
      </form>
    </section>
  );
}
