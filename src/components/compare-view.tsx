"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CircleMinus,
  CirclePlus,
  GitCompare,
  Minus,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { compareResumes, type ComparisonResult } from "@/lib/comparison";
import type { RoleInput } from "@/lib/types";
import { Kicker, Reveal, ScoreBar, SkillChip } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CompareView() {
  const [roles, setRoles] = useState<RoleInput[]>([]);
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [result, setResult] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    fetch("/api/roles")
      .then((r) => r.json())
      .then((d) => {
        const mapped = d.roles?.map((r: { name: string; description: string; required_skills: string[]; accent: string; required_count: number }) => ({
          name: r.name,
          description: r.description,
          required: r.required_skills,
          accent: r.accent,
        })) ?? [];
        setRoles(mapped);
      })
      .catch(() => {});
  }, []);

  const canCompare = oldText.trim().length >= 40 && newText.trim().length >= 40 && roles.length > 0;

  function runComparison() {
    if (!canCompare) return;
    const res = compareResumes(oldText, newText, roles);
    setResult(res);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14 pb-24 sm:px-8">
      <div className="flex items-center justify-between">
        <Link href="/analyze" className="group inline-flex items-center gap-2 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink">
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={2.2} />
          Back to Analyzer
        </Link>
      </div>

      <div className="mt-6 max-w-2xl">
        <Kicker num="✦">Compare</Kicker>
        <h1 className="text-display mt-4 text-4xl font-semibold text-ink sm:text-5xl">
          See how your resume <em className="text-brand">improved</em>.
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          Paste your old and new resume versions to compare skills detected, role match scores, and
          overall improvement.
        </p>
      </div>

      {/* Input panels */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <p className="kicker text-[10px] text-neutral-400">old version</p>
          <textarea
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            placeholder="Paste your old resume text here..."
            className="mt-3 min-h-[200px] w-full resize-y rounded-xl border border-line bg-surface p-4 font-mono text-[12px] leading-relaxed text-ink placeholder:text-neutral-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/10 focus:outline-none"
          />
          <p className="mt-2 text-right font-mono text-[10px] text-neutral-400">
            {oldText.length} chars
          </p>
        </div>

        <div className="panel p-5">
          <p className="kicker text-[10px] text-neutral-400">new version</p>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Paste your updated resume text here..."
            className="mt-3 min-h-[200px] w-full resize-y rounded-xl border border-line bg-surface p-4 font-mono text-[12px] leading-relaxed text-ink placeholder:text-neutral-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/10 focus:outline-none"
          />
          <p className="mt-2 text-right font-mono text-[10px] text-neutral-400">
            {newText.length} chars
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={runComparison}
          disabled={!canCompare}
          className={`group inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-200 ${
            canCompare
              ? "bg-ink text-white shadow-[0_12px_28px_-12px_rgba(23,24,28,0.5)] hover:bg-brand hover:shadow-[0_12px_28px_-12px_rgba(62,79,224,0.6)]"
              : "cursor-not-allowed bg-neutral-100 text-neutral-400"
          }`}
        >
          <GitCompare className="size-4" strokeWidth={2.4} />
          Compare Versions
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
        </button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-12"
        >
          <Kicker num="✓">Comparison Results</Kicker>
          <h2 className="text-display mt-3 text-3xl font-semibold text-ink">Here's what changed.</h2>

          {/* Summary cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="panel p-5">
              <p className="kicker text-[10px] text-neutral-400">skills detected</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-display text-3xl font-semibold text-ink">{result.newSkillCount}</span>
                {result.newSkillCount !== result.oldSkillCount && (
                  <span className={`flex items-center gap-0.5 font-mono text-sm font-semibold ${result.newSkillCount > result.oldSkillCount ? "text-emerald-600" : "text-rose-500"}`}>
                    {result.newSkillCount > result.oldSkillCount ? <Plus className="size-3" strokeWidth={3} /> : <Minus className="size-3" strokeWidth={3} />}
                    {Math.abs(result.newSkillCount - result.oldSkillCount)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">was {result.oldSkillCount}</p>
            </div>

            <div className="panel p-5">
              <p className="kicker text-[10px] text-neutral-400">average improvement</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className={`text-display text-3xl font-semibold ${result.overallImprovement >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                  {result.overallImprovement >= 0 ? "+" : ""}{result.overallImprovement}%
                </span>
                {result.overallImprovement > 0 ? (
                  <TrendingUp className="size-5 text-emerald-500" strokeWidth={2.2} />
                ) : result.overallImprovement < 0 ? (
                  <TrendingDown className="size-5 text-rose-500" strokeWidth={2.2} />
                ) : null}
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">across all roles</p>
            </div>

            <div className="panel p-5">
              <p className="kicker text-[10px] text-neutral-400">best improved</p>
              <p className="text-display mt-3 text-lg font-semibold text-ink">
                {result.bestImprovedRole?.roleName ?? "—"}
              </p>
              {result.bestImprovedRole && result.bestImprovedRole.delta !== 0 && (
                <p className={`mt-1 font-mono text-sm font-semibold ${result.bestImprovedRole.delta > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                  {result.bestImprovedRole.delta > 0 ? "+" : ""}{result.bestImprovedRole.delta}% ({result.bestImprovedRole.oldScore}% → {result.bestImprovedRole.newScore}%)
                </p>
              )}
            </div>
          </div>

          {/* Skill changes */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="panel p-6">
              <div className="flex items-center gap-2">
                <CirclePlus className="size-4 text-emerald-500" strokeWidth={2.2} />
                <p className="text-[14px] font-semibold text-ink">Skills Added ({result.addedSkills.length})</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {result.addedSkills.length === 0 ? (
                  <p className="text-[13px] text-neutral-400">No new skills detected</p>
                ) : (
                  result.addedSkills.map((s) => <SkillChip key={s} label={s} tone="present" />)
                )}
              </div>
            </div>

            <div className="panel p-6">
              <div className="flex items-center gap-2">
                <CircleMinus className="size-4 text-rose-500" strokeWidth={2.2} />
                <p className="text-[14px] font-semibold text-ink">Skills Removed ({result.removedSkills.length})</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {result.removedSkills.length === 0 ? (
                  <p className="text-[13px] text-neutral-400">No skills were removed</p>
                ) : (
                  result.removedSkills.map((s) => <SkillChip key={s} label={s} tone="missing" />)
                )}
              </div>
            </div>
          </div>

          {/* Score changes by role */}
          <div className="mt-8">
            <h3 className="text-display text-lg font-semibold text-ink">Score Changes by Role</h3>
            <div className="mt-4 space-y-3">
              {result.scoreChanges.map((change, i) => (
                <motion.div
                  key={change.roleName}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                  className="panel p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-ink">{change.roleName}</p>
                    <div className="flex items-center gap-3 font-mono text-[12px]">
                      <span className="text-neutral-400">{change.oldScore}%</span>
                      <ArrowRight className="size-3 text-neutral-300" strokeWidth={2.5} />
                      <span className="font-semibold text-ink">{change.newScore}%</span>
                      {change.delta !== 0 && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${change.delta > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                          {change.delta > 0 ? "+" : ""}{change.delta}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative mt-2 h-2">
                    <div className="absolute inset-0 rounded-full bg-neutral-100" />
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-neutral-300"
                      initial={{ width: 0 }}
                      animate={{ width: `${change.oldScore}%` }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-brand"
                      initial={{ width: 0 }}
                      animate={{ width: `${change.newScore}%` }}
                      transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
