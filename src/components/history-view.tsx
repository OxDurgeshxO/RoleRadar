"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Clock3, FileSearch, LineChart, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import type { AnalysisListItem } from "@/lib/types";
import { Kicker, ScoreRing } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HistoryView({ items }: { items: AnalysisListItem[] }) {
  const [list, setList] = useState(items);
  const [deleting, setDeleting] = useState<string | null>(null);

  // chronological (oldest → newest) slice for the journey chart
  const journey = useMemo(() => [...list].reverse().slice(-12), [list]);

  async function remove(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      if (res.ok) setList((l) => l.filter((x) => x.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14 pb-24 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <Kicker num="✦">History</Kicker>
          <h1 className="text-display mt-4 text-4xl font-semibold text-ink sm:text-5xl">Your progress, on record.</h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
            Every run is saved so you can watch your scores climb as you add skills and projects to
            your resume.
          </p>
        </div>
        <Link
          href="/analyze"
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand"
        >
          New analysis
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="panel mt-12 flex flex-col items-center gap-4 p-14 text-center">
          <span className="grid size-14 place-items-center rounded-2xl border border-line bg-paper text-brand">
            <FileSearch className="size-6" strokeWidth={2} />
          </span>
          <p className="text-display text-xl font-semibold text-ink">No analyses yet</p>
          <p className="max-w-sm text-[13.5px] text-neutral-500">
            Run your first resume analysis and the report will appear here for easy revisiting.
          </p>
          <Link href="/analyze?sample=data" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
            Try a sample resume <ArrowUpRight className="size-4" strokeWidth={2.4} />
          </Link>
        </div>
      ) : (
        <>
          {/* ------------------------- score journey ------------------------- */}
          {journey.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="panel mt-12 p-6 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="kicker text-[10px] text-neutral-400">score journey</p>
                  <h2 className="text-display mt-2 text-xl font-semibold text-ink">Your top-match trend.</h2>
                </div>
                <LineChart className="size-5 text-brand" strokeWidth={2} />
              </div>
              <div className="mt-6 flex h-32 items-end gap-2 sm:gap-3">
                {journey.map((a, i) => {
                  const isLatest = i === journey.length - 1;
                  const prev = i > 0 ? journey[i - 1] : null;
                  const delta = prev ? a.top_score - prev.top_score : 0;
                  return (
                    <div key={a.id} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                      <span
                        className={`absolute -top-1 font-mono text-[10px] transition-opacity ${
                          isLatest ? "text-brand opacity-100" : "text-neutral-400 opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {a.top_score}%
                        {delta !== 0 && (
                          <span className={delta > 0 ? "text-emerald-600" : "text-rose-500"}>
                            {" "}
                            {delta > 0 ? `+${delta}` : delta}
                          </span>
                        )}
                      </span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(a.top_score, 6)}%` }}
                        transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                        className={`w-full max-w-10 rounded-t-lg transition-colors ${
                          isLatest ? "bg-brand" : "bg-neutral-200 group-hover:bg-brand/40"
                        }`}
                        title={`${a.top_role} — ${a.top_score}% · ${new Date(a.created_at).toLocaleDateString()}`}
                      />
                      <span className="mt-2 hidden font-mono text-[9px] text-neutral-400 sm:block">
                        {new Date(a.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ----------------------------- cards ----------------------------- */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a, i) => {
              const older = i + 1 < list.length ? list[i + 1] : null;
              const delta = older ? a.top_score - older.top_score : 0;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3), ease: EASE }}
                  className="panel panel-hover group relative overflow-hidden p-5"
                >
                  <Link href={`/results/${a.id}`} className="flex items-center gap-5">
                    <ScoreRing score={a.top_score} size={86} stroke={7} />
                    <div className="min-w-0 flex-1">
                      <p className="text-display truncate text-[16px] font-semibold text-ink transition-colors group-hover:text-brand">
                        {a.top_role}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-neutral-500">
                        <Clock3 className="size-3" strokeWidth={2.2} />
                        {new Date(a.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="font-mono text-[11px] text-neutral-400">{a.skill_count} skills</span>
                        {delta !== 0 && (
                          <span
                            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                              delta > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                            }`}
                          >
                            {delta > 0 ? <TrendingUp className="size-3" strokeWidth={2.4} /> : <TrendingDown className="size-3" strokeWidth={2.4} />}
                            {delta > 0 ? `+${delta}` : delta}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-neutral-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" strokeWidth={2.2} />
                  </Link>
                  <button
                    onClick={() => remove(a.id)}
                    disabled={deleting === a.id}
                    aria-label="Delete analysis"
                    className="absolute right-3 bottom-3 rounded-lg p-2 text-neutral-300 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-40"
                  >
                    <Trash2 className={`size-4 ${deleting === a.id ? "animate-pulse" : ""}`} strokeWidth={2.2} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
