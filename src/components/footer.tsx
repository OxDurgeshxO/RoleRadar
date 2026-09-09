import { ShieldCheck } from "lucide-react";
import { DISCLAIMER } from "@/lib/explain";

export function Footer() {
  return (
    <footer className="no-print border-t border-line bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[15px] font-semibold text-ink">
              Role<span className="text-brand">Fit</span>
            </p>
            <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-neutral-500 uppercase">
              Career readiness, measured honestly
            </p>
            <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-neutral-500">
              An educational resume analyzer and job-role matching engine for students.
            </p>
          </div>
          <div className="flex max-w-xl items-start gap-3 rounded-xl border border-line bg-surface p-4">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.2} />
            <p className="text-[12.5px] leading-relaxed text-ink-soft">{DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
