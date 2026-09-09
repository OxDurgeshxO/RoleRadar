"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  Gauge,
  MessagesSquare,
  Quote,
  RotateCcw,
  ScanSearch,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import type { AtsReport } from "@/lib/ats";
import { computeSkillImpact, type ImpactItem } from "@/lib/impact";
import { matchRole, scoreAllRoles } from "@/lib/match";
import { generateInterviewPrep } from "@/lib/prep";
import { skillLabel } from "@/lib/skills";
import type { AnalysisReport, RoleInput } from "@/lib/types";
import { Reveal, ScoreBar, ScoreRing } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_COLORS = {
  present: { bg: "#10b981", label: "present" },
  partial: { bg: "#f59e0b", label: "partial" },
  missing: { bg: "rgba(244,63,94,0.14)", label: "missing" },
} as const;

/* ------------------------------ stat tiles ------------------------------ */

export function StatsTiles({ report, extractedCount }: { report: AnalysisReport; extractedCount: number }) {
  const scores = report.role_analysis.map((r) => r.match_score);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const above50 = scores.filter((s) => s >= 50).length;
  const best = report.recommended_roles[0];

  const tiles = [
    { icon: Trophy, label: "best match", value: `${best?.match_score ?? 0}%`, sub: best?.role_name ?? "—", color: "#3e4fe0" },
    { icon: Gauge, label: "average score", value: `${avg}%`, sub: `across ${scores.length} roles`, color: "#0d9488" },
    { icon: ScanSearch, label: "skills found", value: String(extractedCount), sub: "via keyword + synonym rules", color: "#7c3aed" },
    { icon: Target, label: "roles ≥ 50%", value: `${above50}/${scores.length}`, sub: "half credit or better", color: "#d97706" },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: EASE }}
          className="panel panel-hover p-5"
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.22em] text-neutral-400 uppercase">{t.label}</p>
            <t.icon className="size-4" strokeWidth={2} style={{ color: t.color }} />
          </div>
          <p className="text-display mt-3 text-3xl font-semibold text-ink">{t.value}</p>
          <p className="mt-1 truncate text-[11.5px] text-neutral-500">{t.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* --------------------------- resume snapshot --------------------------- */

export function SnapshotCard({ excerpt }: { excerpt: string }) {
  return (
    <div className="mt-6 flex items-start gap-4 rounded-xl border border-line bg-paper/60 p-5">
      <Quote className="mt-0.5 size-4 shrink-0 text-brand/60" strokeWidth={2.2} />
      <div>
        <p className="font-mono text-[10px] tracking-[0.22em] text-neutral-400 uppercase">resume snapshot</p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-500 italic">{excerpt}…</p>
      </div>
    </div>
  );
}

/* --------------------------- ATS readiness --------------------------- */

export function AtsCard({ ats }: { ats: AtsReport }) {
  const ringColor = ats.score >= 75 ? "#10b981" : ats.score >= 55 ? "#3e4fe0" : "#f59e0b";
  return (
    <div className="panel h-full p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker text-[10px] text-neutral-400">ats readiness</p>
          <h3 className="text-display mt-2 text-xl font-semibold text-ink">Recruiter-scan fitness.</h3>
        </div>
        <ClipboardCheck className="size-5 text-brand" strokeWidth={2} />
      </div>

      <div className="mt-6 flex items-center gap-6">
        <ScoreRing score={ats.score} size={104} stroke={9} color={ringColor} sublabel="ats score" />
        <p className="text-[12.5px] leading-relaxed text-neutral-500">
          {ats.score >= 75
            ? "Well structured — scanners and recruiters will find what they need."
            : ats.score >= 55
              ? "Decent structure, but a few fixes will make your resume noticeably easier to scan."
              : "Several structural gaps — work through the checklist below to strengthen it."}
        </p>
      </div>

      <div className="mt-6 grid gap-2 border-t border-line-soft pt-5 sm:grid-cols-2">
        {ats.checks.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
            className={`rounded-lg border px-3 py-2.5 ${c.passed ? "border-line bg-paper/50" : "border-rose-200 bg-rose-50/60"}`}
          >
            <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink">
              {c.passed ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" strokeWidth={2.2} />
              ) : (
                <XCircle className="size-4 shrink-0 text-rose-400" strokeWidth={2.2} />
              )}
              {c.label}
            </p>
            {!c.passed && <p className="mt-1 pl-6 text-[11.5px] leading-snug text-ink-soft">{c.tip}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- interview prep --------------------------- */

export function InterviewPrepCard({
  roleName,
  present,
  missing,
}: {
  roleName: string;
  present: string[];
  missing: string[];
}) {
  const questions = useMemo(
    () => generateInterviewPrep(roleName, present, missing),
    [roleName, present, missing],
  );
  return (
    <div className="panel h-full p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker text-[10px] text-neutral-400">interview prep</p>
          <h3 className="text-display mt-2 text-xl font-semibold text-ink">Rehearse for {roleName}.</h3>
        </div>
        <MessagesSquare className="size-5 text-brand" strokeWidth={2} />
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-500">
        Questions drawn from your strongest and weakest signals — answer each out loud in under a minute.
      </p>

      <ol className="mt-5 space-y-3">
        {questions.map((q, i) => (
          <motion.li
            key={q}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
            className="flex items-start gap-3"
          >
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-brand/[0.07] font-mono text-[10.5px] font-semibold text-brand">
              {i + 1}
            </span>
            <p className="text-[13px] leading-relaxed text-ink">{q}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/* --------------------------- coverage matrix --------------------------- */

export function CoverageMatrix({
  roles,
  extractedIds,
  order,
}: {
  roles: RoleInput[];
  extractedIds: string[];
  order: string[];
}) {
  const rows = useMemo(() => {
    const byName = new Map(roles.map((r) => [r.name, r]));
    return order
      .map((name) => byName.get(name))
      .filter((r): r is RoleInput => Boolean(r))
      .map((r) => ({ role: r, match: matchRole(r.name, r.required, extractedIds) }));
  }, [roles, extractedIds, order]);

  return (
    <div className="panel h-full p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="kicker text-[10px] text-neutral-400">coverage matrix</p>
          <h3 className="text-display mt-2 text-xl font-semibold text-ink">Every skill, every role.</h3>
        </div>
        <div className="flex items-center gap-3">
          {(Object.keys(STATUS_COLORS) as (keyof typeof STATUS_COLORS)[]).map((k) => (
            <span key={k} className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 uppercase">
              <span
                className="size-2.5 rounded-[4px]"
                style={{
                  background: STATUS_COLORS[k].bg,
                  boxShadow: k === "missing" ? "inset 0 0 0 1px rgba(244,63,94,0.45)" : undefined,
                }}
              />
              {k}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3.5">
        {rows.map(({ role, match }, ri) => (
          <motion.div
            key={role.name}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.45, delay: Math.min(ri * 0.04, 0.35), ease: EASE }}
            className="grid grid-cols-[130px_1fr_44px] items-center gap-3 sm:grid-cols-[170px_1fr_48px]"
          >
            <p className="truncate text-[12.5px] font-medium text-ink" title={role.name}>
              {role.name}
            </p>
            <div className="flex flex-wrap gap-1">
              {role.required.map((id) => {
                const status = match.present.includes(id) ? "present" : match.partial.includes(id) ? "partial" : "missing";
                return (
                  <span
                    key={id}
                    title={`${skillLabel(id)} — ${status}`}
                    className="h-4 w-4 rounded-[5px] transition-transform duration-150 hover:scale-125"
                    style={{
                      background: STATUS_COLORS[status].bg,
                      boxShadow: status === "missing" ? "inset 0 0 0 1px rgba(244,63,94,0.45)" : undefined,
                    }}
                  />
                );
              })}
            </div>
            <p className="text-right font-mono text-[12px] text-ink-soft">{match.matchScore}%</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ impact panel ------------------------------ */

export function ImpactPanel({ impact }: { impact: ImpactItem[] }) {
  const top = impact.slice(0, 6);
  return (
    <div className="panel h-full p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker text-[10px] text-neutral-400">highest impact</p>
          <h3 className="text-display mt-2 text-xl font-semibold text-ink">Skills that unlock the most.</h3>
        </div>
        <Zap className="size-5 text-brand" strokeWidth={2} />
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-500">
        Learning any of these raises several of your role scores at once.
      </p>

      <div className="mt-5 space-y-2.5">
        {top.length === 0 && <p className="text-[13px] text-neutral-500">No gaps found — remarkable coverage.</p>}
        {top.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
            className="flex items-center gap-3 rounded-xl border border-line bg-paper/50 px-4 py-3"
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-brand/[0.07] font-mono text-[10px] font-semibold text-brand">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-[12.5px] text-ink">{item.label}</p>
              <p className="text-[11px] text-neutral-500">lifts {item.rolesLifted} role{item.rolesLifted > 1 ? "s" : ""}</p>
            </div>
            <span className="shrink-0 font-mono text-[12px] font-semibold text-brand">+{item.gain} pts</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- skill simulator ----------------------------- */

export function SkillSimulator({ roles, extractedIds }: { roles: RoleInput[]; extractedIds: string[] }) {
  const impact = useMemo(() => computeSkillImpact(roles, extractedIds), [roles, extractedIds]);
  const base = useMemo(() => scoreAllRoles(roles, extractedIds), [roles, extractedIds]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const candidates = impact.slice(0, 12);
  const simulatedIds = useMemo(() => [...extractedIds, ...selected], [extractedIds, selected]);
  const simulated = useMemo(() => scoreAllRoles(roles, simulatedIds), [roles, simulatedIds]);

  const baseMap = useMemo(() => new Map(base.map((m) => [m.roleName, m.matchScore])), [base]);
  const topSim = simulated.slice(0, 6);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="panel relative overflow-hidden p-6 sm:p-8">
      <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-brand/0 via-brand/25 to-brand/0" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="kicker flex items-center gap-2 text-[10px] text-neutral-400">
            <FlaskConical className="size-3.5 text-brand" strokeWidth={2.2} />
            what-if simulator
          </p>
          <h3 className="text-display mt-2 text-2xl font-semibold text-ink">
            Pick skills to learn. Watch scores rise.
          </h3>
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-neutral-500">
            Toggle the skills below to simulate how your matches would change once you have learned
            them — computed live by the same scoring rule.
          </p>
        </div>
        {selected.size > 0 && (
          <button
            onClick={() => setSelected(new Set())}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-[12px] font-medium text-ink-soft transition-colors hover:border-neutral-300 hover:text-ink"
          >
            <RotateCcw className="size-3.5" strokeWidth={2.2} />
            Reset ({selected.size})
          </button>
        )}
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-2">
        {/* toggles */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-neutral-400 uppercase">your biggest gaps</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {candidates.map((c) => {
              const on = selected.has(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[12px] transition-all duration-200 ${
                    on
                      ? "border-brand bg-brand text-white shadow-[0_6px_16px_-6px_rgba(62,79,224,0.55)]"
                      : "border-line bg-surface text-ink-soft hover:border-brand/40 hover:text-brand"
                  }`}
                >
                  {on && <Check className="size-3.5" strokeWidth={3} />}
                  {c.label}
                  <span className={`text-[10px] ${on ? "text-white/75" : "text-brand/80"}`}>+{c.gain}</span>
                </button>
              );
            })}
            {candidates.length === 0 && (
              <p className="flex items-center gap-2 text-[13px] text-neutral-500">
                <Sparkles className="size-4 text-brand" strokeWidth={2.2} />
                Nothing to simulate — you already cover every tracked skill.
              </p>
            )}
          </div>
        </div>

        {/* projected scores */}
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-neutral-400 uppercase">
            <TrendingUp className="size-3.5 text-brand" strokeWidth={2.2} />
            projected top matches
          </p>
          <div className="mt-3 space-y-3">
            {topSim.map((m, i) => {
              const before = baseMap.get(m.roleName) ?? 0;
              const delta = m.matchScore - before;
              return (
                <div key={m.roleName} className="rounded-xl border border-line bg-paper/50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-[13px] font-medium text-ink">{m.roleName}</p>
                    <div className="flex shrink-0 items-center gap-2 font-mono text-[12px]">
                      <span className={delta > 0 ? "text-neutral-400" : "text-ink"}>{before}%</span>
                      {delta > 0 && (
                        <>
                          <span className="text-neutral-300">→</span>
                          <motion.span
                            key={`${m.roleName}-${m.matchScore}`}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="font-semibold text-brand"
                          >
                            {m.matchScore}%
                          </motion.span>
                          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">+{delta}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative mt-2">
                    <ScoreBar score={before} color="#d8d6cd" delay={0} />
                    <motion.div
                      className="absolute inset-y-0 left-0 h-1.5 rounded-full bg-brand"
                      initial={false}
                      animate={{ width: `${m.matchScore}%` }}
                      transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {selected.size === 0 && (
            <p className="mt-3 text-[11.5px] text-neutral-400">
              Select a skill on the left to preview your improved scores.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- insight section ---------------------------- */

export function InsightSection({
  roles,
  extractedIds,
  order,
}: {
  roles: RoleInput[];
  extractedIds: string[];
  order: string[];
}) {
  const impact = useMemo(() => computeSkillImpact(roles, extractedIds), [roles, extractedIds]);
  return (
    <div className="mt-14">
      <Reveal>
        <p className="kicker flex items-center gap-2.5 text-neutral-400">
          <span className="text-brand">03</span>
          <span className="h-px w-6 bg-neutral-300" />
          <span className="text-ink-soft">gap intelligence</span>
        </p>
        <h2 className="text-display mt-3 text-3xl font-semibold text-ink sm:text-4xl">Where the points are hiding.</h2>
      </Reveal>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <Reveal delay={0.05}>
          <CoverageMatrix roles={roles} extractedIds={extractedIds} order={order} />
        </Reveal>
        <Reveal delay={0.12}>
          <ImpactPanel impact={impact} />
        </Reveal>
      </div>
    </div>
  );
}
