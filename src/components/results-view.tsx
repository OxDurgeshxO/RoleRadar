"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleMinus,
  CirclePlus,
  Copy,
  Download,
  Loader2,
  Medal,
  Printer,
  Route,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import type { AtsReport } from "@/lib/ats";
import type { RoleInput, StoredAnalysis } from "@/lib/types";
import { Kicker, Reveal, ScoreBar, ScoreRing, SkillChip } from "./ui";
import {
  AtsCard,
  InsightSection,
  InterviewPrepCard,
  SkillSimulator,
  SnapshotCard,
  StatsTiles,
} from "./dashboard-widgets";
import {
  CertificationsPanel,
  KeywordDensityPanel,
  QuickActionsPanel,
  SkillRadarPanel,
  SuggestionsPanel,
} from "./new-features";

interface RoleMeta {
  name: string;
  accent: string;
  description: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function ResultsView({
  analysis,
  roles,
  rolesFull,
  extractedIds,
  ats,
  rawResumeText,
}: {
  analysis: StoredAnalysis;
  roles: RoleMeta[];
  rolesFull: RoleInput[];
  extractedIds: string[];
  ats: AtsReport;
  rawResumeText: string;
}) {
  const { result } = analysis;
  const accentOf = useMemo(() => {
    const m = new Map(roles.map((r) => [r.name, r.accent]));
    return (name: string) => m.get(name) ?? "#3e4fe0";
  }, [roles]);

  const [openRole, setOpenRole] = useState<string | null>(result.role_analysis[0]?.role_name ?? null);
  const [copied, setCopied] = useState(false);

  // roadmap state (re-targetable)
  const [roadmapRole, setRoadmapRole] = useState<string>(analysis.target_role ?? result.recommended_roles[0]?.role_name ?? "");
  const [weeks, setWeeks] = useState(result.learning_roadmap);
  const [roadmapScore, setRoadmapScore] = useState<number | null>(
    result.role_analysis.find((r) => r.role_name === roadmapRole)?.match_score ?? null,
  );
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  async function switchRoadmapRole(name: string) {
    setRoadmapRole(name);
    if (!name) return;
    setRoadmapLoading(true);
    try {
      const res = await fetch(`/api/analyses/${analysis.id}/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_name: name }),
      });
      const data = await res.json();
      if (res.ok) {
        setWeeks(data.learning_roadmap);
        setRoadmapScore(data.match_score);
      }
    } catch {
      /* keep current plan on failure */
    } finally {
      setRoadmapLoading(false);
    }
  }

  function copyJson() {
    navigator.clipboard
      .writeText(JSON.stringify(result, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rolefit-report-${analysis.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const top = result.recommended_roles[0];
  const topAnalysis = result.role_analysis.find((r) => r.role_name === top?.role_name);
  const dateStr = new Date(analysis.created_at).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 pb-24 sm:px-8">
      {/* ------------------------- top action bar ------------------------- */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Link href="/analyze" className="group inline-flex items-center gap-2 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink">
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={2.2} />
          New analysis
        </Link>
        <div className="flex items-center gap-2">
          <p className="mr-2 hidden font-mono text-[11px] text-neutral-400 sm:block">report · {dateStr}</p>
          <button
            onClick={copyJson}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12px] font-medium text-ink-soft transition-colors hover:border-neutral-300 hover:text-ink"
          >
            {copied ? <Check className="size-3.5 text-brand" strokeWidth={2.4} /> : <Copy className="size-3.5" strokeWidth={2.2} />}
            {copied ? "Copied" : "Copy JSON"}
          </button>
          <button
            onClick={downloadJson}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12px] font-medium text-ink-soft transition-colors hover:border-neutral-300 hover:text-ink"
          >
            <Download className="size-3.5" strokeWidth={2.2} />
            Export
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12px] font-medium text-ink-soft transition-colors hover:border-neutral-300 hover:text-ink"
          >
            <Printer className="size-3.5" strokeWidth={2.2} />
            Print
          </button>
        </div>
      </div>

      {/* ----------------------------- hero panel ----------------------------- */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="panel relative mt-6 overflow-hidden p-7 sm:p-9"
      >
        <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-brand/0 via-brand/25 to-brand/0" />
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-3">
            <ScoreRing score={top?.match_score ?? 0} size={188} stroke={12} sublabel="top match score" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/[0.06] px-3 py-1 font-mono text-[10.5px] tracking-[0.16em] text-brand uppercase">
              <Trophy className="size-3" strokeWidth={2.4} /> best fit role
            </span>
          </div>

          <div>
            <Kicker num="✦">Your closest match</Kicker>
            <h1 className="text-display mt-3 text-4xl font-semibold text-ink sm:text-5xl">{top?.role_name ?? "—"}</h1>
            <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">{result.overall_summary}</p>

            {/* podium */}
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {result.recommended_roles.map((r, i) => (
                <div key={r.role_name} className="rounded-xl border border-line bg-paper/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase">#{i + 1}</span>
                    <Medal
                      className="size-4"
                      strokeWidth={2}
                      style={{ color: i === 0 ? "#3e4fe0" : i === 1 ? "#a1a5ae" : "#c98d5e" }}
                    />
                  </div>
                  <p className="text-display mt-2.5 text-[15px] leading-tight font-semibold text-ink">{r.role_name}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <ScoreBar score={r.match_score} delay={0.3 + i * 0.12} color={accentOf(r.role_name)} />
                    <span className="font-mono text-[11px] text-ink-soft">{r.match_score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* extracted skills */}
        <div className="mt-8 border-t border-line-soft pt-6">
          <p className="kicker text-[10px] text-neutral-400">
            {analysis.extracted_skills.length} skills extracted from the resume
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {analysis.extracted_skills.map((s) => (
              <SkillChip key={s} label={s} tone="accent" />
            ))}
          </div>
        </div>

        <SnapshotCard excerpt={analysis.resume_excerpt} />
      </motion.section>

      {/* ------------------------------ stat tiles ------------------------------ */}
      <StatsTiles report={result} extractedCount={analysis.extracted_skills.length} />

      {/* ------------------------- role breakdown ------------------------- */}
      <section className="mt-14">
        <Kicker num="01">Role-by-role breakdown</Kicker>
        <h2 className="text-display mt-3 text-3xl font-semibold text-ink sm:text-4xl">Every role, scored.</h2>

        <div className="mt-8 space-y-3">
          {result.role_analysis.map((r, idx) => {
            const open = openRole === r.role_name;
            const accent = r.match_score >= 50 ? accentOf(r.role_name) : "#a1a5ae";
            return (
              <motion.div
                key={r.role_name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.04, 0.3), ease: EASE }}
                className={`panel overflow-hidden transition-colors duration-300 ${open ? "border-brand/30" : ""}`}
              >
                <button
                  onClick={() => setOpenRole(open ? null : r.role_name)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left sm:gap-6 sm:px-6"
                >
                  <span className="w-7 shrink-0 font-mono text-[11px] text-neutral-400">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-display truncate text-[16px] font-semibold text-ink">{r.role_name}</p>
                      <div className="flex items-center gap-3">
                        <div className="hidden w-40 sm:block">
                          <ScoreBar score={r.match_score} color={accent} delay={0.15} />
                        </div>
                        <span className="w-12 text-right font-mono text-[15px] font-semibold" style={{ color: accent }}>
                          {r.match_score}%
                        </span>
                        <ChevronDown
                          className={`size-4 shrink-0 text-neutral-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                          strokeWidth={2.2}
                        />
                      </div>
                    </div>
                    <div className="mt-2 sm:hidden">
                      <ScoreBar score={r.match_score} color={accent} delay={0.15} />
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-5 border-t border-line-soft px-5 py-5 sm:grid-cols-3 sm:px-6">
                        <SkillGroup
                          icon={<Check className="size-3.5" strokeWidth={3} />}
                          title="present"
                          tone="text-emerald-600"
                          skills={r.skills_present}
                          chipTone="present"
                        />
                        <SkillGroup
                          icon={<CircleMinus className="size-3.5" strokeWidth={2.6} />}
                          title="partial"
                          tone="text-amber-600"
                          skills={r.skills_partial}
                          chipTone="partial"
                        />
                        <SkillGroup
                          icon={<CirclePlus className="size-3.5" strokeWidth={2.6} />}
                          title="missing"
                          tone="text-rose-500"
                          skills={r.skills_missing}
                          chipTone="missing"
                        />
                      </div>
                      <p className="border-t border-line-soft px-5 py-4 text-[13px] leading-relaxed text-ink-soft sm:px-6">
                        {r.short_explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --------------------- readiness & rehearsal --------------------- */}
      <section className="mt-14">
        <Reveal>
          <p className="kicker flex items-center gap-2.5 text-neutral-400">
            <span className="text-brand">02</span>
            <span className="h-px w-6 bg-neutral-300" />
            <span className="text-ink-soft">readiness & rehearsal</span>
          </p>
          <h2 className="text-display mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            Polish the document. Prep the answers.
          </h2>
        </Reveal>
        <div className="mt-8 grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal delay={0.05}>
            <AtsCard ats={ats} />
          </Reveal>
          <Reveal delay={0.12}>
            <InterviewPrepCard
              roleName={top?.role_name ?? "your top role"}
              present={topAnalysis?.skills_present ?? []}
              missing={topAnalysis?.skills_missing ?? []}
            />
          </Reveal>
        </div>
      </section>

      {/* --------------------- gap intelligence (matrix + impact) --------------------- */}
      <InsightSection roles={rolesFull} extractedIds={extractedIds} order={result.role_analysis.map((r) => r.role_name)} />

      {/* --------------------------- what-if simulator --------------------------- */}
      <section className="mt-14">
        <SkillSimulator roles={rolesFull} extractedIds={extractedIds} />
      </section>

      {/* --------------------- suggestions & certifications --------------------- */}
      <section className="mt-14" id="certifications">
        <Reveal>
          <p className="kicker flex items-center gap-2.5 text-neutral-400">
            <span className="text-brand">04</span>
            <span className="h-px w-6 bg-neutral-300" />
            <span className="text-ink-soft">grow & improve</span>
          </p>
          <h2 className="text-display mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            Actionable improvements.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Reveal delay={0.05}>
            <SuggestionsPanel
              rawText={rawResumeText}
              extractedSkills={extractedIds}
              missingSkills={topAnalysis?.skills_missing ?? []}
              topRoleName={top?.role_name ?? "your target role"}
            />
          </Reveal>
          <div className="space-y-5">
            <Reveal delay={0.1}>
              <CertificationsPanel
                extractedSkills={extractedIds}
                missingSkills={topAnalysis?.skills_missing ?? []}
              />
            </Reveal>
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Reveal delay={0.15}>
            <KeywordDensityPanel rawText={rawResumeText} extractedSkills={extractedIds} />
          </Reveal>
          <Reveal delay={0.2}>
            <SkillRadarPanel
              roleScores={result.role_analysis.map((r) => ({
                name: r.role_name,
                score: r.match_score,
                accent: accentOf(r.role_name),
              }))}
            />
          </Reveal>
        </div>
      </section>

      {/* --------------------------- roadmap --------------------------- */}
      <section className="mt-16" id="learning-roadmap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker num="05">Learning roadmap</Kicker>
            <h2 className="text-display mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              Your next {weeks.length} weeks, planned.
            </h2>
          </div>
          <div className="no-print flex items-center gap-3">
            <label className="font-mono text-[10.5px] tracking-[0.2em] text-neutral-400 uppercase">plan for</label>
            <div className="relative">
              <select
                value={roadmapRole}
                onChange={(e) => switchRoadmapRole(e.target.value)}
                className="appearance-none rounded-full border border-line bg-surface py-2 pr-9 pl-4 text-[13px] font-medium text-ink focus:border-brand/40 focus:ring-2 focus:ring-brand/10 focus:outline-none"
              >
                {result.role_analysis.map((r) => (
                  <option key={r.role_name} value={r.role_name}>
                    {r.role_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-3.5 -translate-y-1/2 text-neutral-400" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        <p className="no-print mt-3 flex items-center gap-2 text-[12.5px] text-neutral-500">
          <Route className="size-3.5 text-brand" strokeWidth={2.2} />
          Built from the missing and partial skills of{" "}
          <span className="font-medium text-ink">{roadmapRole}</span>
          {roadmapScore !== null && <span className="font-mono text-neutral-500">(current match {roadmapScore}%)</span>}
          {roadmapLoading && <Loader2 className="size-3.5 animate-spin text-brand" strokeWidth={2.4} />}
        </p>

        <div className="relative mt-9">
          <div className="absolute top-2 bottom-2 left-[15px] w-px bg-gradient-to-b from-brand/50 via-neutral-200 to-transparent sm:left-[19px]" />
          <div className="space-y-5">
            {weeks.map((w, i) => (
              <motion.div
                key={`${roadmapRole}-${w.week}-${i}`}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="relative flex gap-5 sm:gap-7"
              >
                <div className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-brand/40 bg-paper font-mono text-[11px] font-semibold text-brand sm:size-10 sm:text-[12px]">
                  {String(w.week).padStart(2, "0")}
                </div>
                <div className="panel panel-hover flex-1 p-5 sm:p-6">
                  <p className="kicker text-[9px] text-neutral-400">week {w.week}</p>
                  <h3 className="text-display mt-1.5 text-lg font-semibold text-ink">{w.focus}</h3>
                  <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-soft">{w.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- disclaimer --------------------------- */}
      <section className="mt-16">
        <div className="panel flex flex-col items-start gap-5 p-7 sm:flex-row sm:items-center sm:p-8">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand/20 bg-brand/[0.06] text-brand">
            <ShieldCheck className="size-5" strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-display text-[16px] font-semibold text-ink">Responsible AI note</p>
            <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-ink-soft">{result.disclaimer}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SkillGroup({
  icon,
  title,
  tone,
  skills,
  chipTone,
}: {
  icon: React.ReactNode;
  title: string;
  tone: string;
  skills: string[];
  chipTone: "present" | "partial" | "missing";
}) {
  return (
    <div>
      <p className={`flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase ${tone}`}>
        {icon}
        {title} <span className="text-neutral-400">({skills.length})</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.length === 0 ? (
          <span className="text-[12px] text-neutral-400">none</span>
        ) : (
          skills.map((s) => <SkillChip key={s} label={s} tone={chipTone} />)
        )}
      </div>
    </div>
  );
}
