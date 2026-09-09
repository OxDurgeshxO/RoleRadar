"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  ChevronRight,
  Clock,
  GraduationCap,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { recommendCertifications, type CertificationRec } from "@/lib/certifications";
import { analyzeKeywordDensity, generateSuggestions, type Suggestion } from "@/lib/suggestions";
import { Reveal, ScoreBar, SkillChip } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------ Suggestions Panel ------------------------------ */

export function SuggestionsPanel({
  rawText,
  extractedSkills,
  missingSkills,
  topRoleName,
}: {
  rawText: string;
  extractedSkills: string[];
  missingSkills: string[];
  topRoleName: string;
}) {
  const suggestions = useMemo(
    () => generateSuggestions(rawText, extractedSkills, missingSkills, topRoleName),
    [rawText, extractedSkills, missingSkills, topRoleName],
  );

  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? suggestions : suggestions.slice(0, 4);

  const priorityStyles = {
    high: "border-rose-200 bg-rose-50/60",
    medium: "border-amber-200 bg-amber-50/60",
    low: "border-neutral-200 bg-neutral-50/60",
  };

  const priorityIcons = {
    high: <AlertTriangle className="size-4 text-rose-500" strokeWidth={2.2} />,
    medium: <Lightbulb className="size-4 text-amber-500" strokeWidth={2.2} />,
    low: <Sparkles className="size-4 text-neutral-400" strokeWidth={2.2} />,
  };

  const categoryLabels = {
    achievement: "Achievement",
    keyword: "Keywords",
    structure: "Structure",
    project: "Projects",
  };

  return (
    <div className="panel p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker text-[10px] text-neutral-400">smart suggestions</p>
          <h3 className="text-display mt-2 text-xl font-semibold text-ink">Ways to strengthen your resume.</h3>
        </div>
        <Lightbulb className="size-5 text-brand" strokeWidth={2} />
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-500">
        Actionable improvements based on your content and target role.
      </p>

      {suggestions.length === 0 ? (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <Sparkles className="size-5 text-emerald-600" strokeWidth={2} />
          <p className="text-[13px] text-emerald-700">Your resume looks well-structured! Keep iterating based on feedback.</p>
        </div>
      ) : (
        <>
          <div className="mt-5 space-y-3">
            {displayed.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                className={`rounded-xl border p-4 ${priorityStyles[s.priority]}`}
              >
                <div className="flex items-start gap-3">
                  {priorityIcons[s.priority]}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-ink">{s.title}</p>
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-medium text-neutral-500 uppercase">
                        {categoryLabels[s.category]}
                      </span>
                    </div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{s.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {suggestions.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-brand transition-colors hover:text-brand-deep"
            >
              {showAll ? "Show less" : `Show ${suggestions.length - 4} more suggestions`}
              <ChevronRight className={`size-4 transition-transform ${showAll ? "rotate-90" : ""}`} strokeWidth={2.2} />
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------ Keyword Density ------------------------------ */

export function KeywordDensityPanel({
  rawText,
  extractedSkills,
}: {
  rawText: string;
  extractedSkills: string[];
}) {
  const density = useMemo(
    () => analyzeKeywordDensity(rawText, extractedSkills),
    [rawText, extractedSkills],
  );

  const top = density.slice(0, 8);
  const maxCount = Math.max(...top.map((k) => k.count), 1);

  return (
    <div className="panel p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker text-[10px] text-neutral-400">keyword density</p>
          <h3 className="text-display mt-2 text-xl font-semibold text-ink">How often skills appear.</h3>
        </div>
        <BarChart3 className="size-5 text-brand" strokeWidth={2} />
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-500">
        Frequently mentioned skills signal expertise — but balance is key.
      </p>

      <div className="mt-5 space-y-3">
        {top.length === 0 ? (
          <p className="text-[13px] text-neutral-400">No keyword frequency data available.</p>
        ) : (
          top.map((k, i) => (
            <motion.div
              key={k.skill}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
              className="flex items-center gap-3"
            >
              <span className="w-24 shrink-0 truncate font-mono text-[11px] text-ink">{k.skill}</span>
              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                  <motion.div
                    className="h-full rounded-full bg-brand"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(k.count / maxCount) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                  />
                </div>
              </div>
              <span className="w-16 shrink-0 text-right font-mono text-[11px] text-neutral-500">
                {k.count}× ({k.density}%)
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Certifications ------------------------------ */

export function CertificationsPanel({
  extractedSkills,
  missingSkills,
}: {
  extractedSkills: string[];
  missingSkills: string[];
}) {
  const certs = useMemo(
    () => recommendCertifications(extractedSkills, missingSkills, 4),
    [extractedSkills, missingSkills],
  );

  const difficultyColors = {
    beginner: "text-emerald-600 bg-emerald-50 border-emerald-200",
    intermediate: "text-amber-600 bg-amber-50 border-amber-200",
    advanced: "text-rose-600 bg-rose-50 border-rose-200",
  };

  return (
    <div className="panel p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker text-[10px] text-neutral-400">recommended certifications</p>
          <h3 className="text-display mt-2 text-xl font-semibold text-ink">Credentials that boost your profile.</h3>
        </div>
        <Award className="size-5 text-brand" strokeWidth={2} />
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-500">
        Based on your skills and gaps — these certifications add credibility.
      </p>

      {certs.length === 0 ? (
        <div className="mt-5 rounded-xl border border-line bg-paper/50 p-4">
          <p className="text-[13px] text-neutral-500">No specific certifications recommended for your current skill set.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
              className="rounded-xl border border-line bg-paper/50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-semibold text-ink">{cert.name}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase ${difficultyColors[cert.difficulty]}`}>
                      {cert.difficulty}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-neutral-500">{cert.provider}</p>
                  <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">{cert.description}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <Clock className="size-3" strokeWidth={2.2} />
                      ~{cert.estimatedHours}h
                    </span>
                    <div className="flex gap-1">
                      {cert.relevantSkills.slice(0, 3).map((s) => (
                        <SkillChip key={s} label={s} tone="accent" className="text-[9px] py-0.5 px-1.5" />
                      ))}
                    </div>
                  </div>
                </div>
                <GraduationCap className="size-5 shrink-0 text-brand/40" strokeWidth={2} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Skill Radar (Simple Bar Version) ------------------------------ */

export function SkillRadarPanel({
  roleScores,
}: {
  roleScores: { name: string; score: number; accent: string }[];
}) {
  const top6 = roleScores.slice(0, 6);

  return (
    <div className="panel p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker text-[10px] text-neutral-400">role fit spectrum</p>
          <h3 className="text-display mt-2 text-xl font-semibold text-ink">Your match across roles.</h3>
        </div>
        <TrendingUp className="size-5 text-brand" strokeWidth={2} />
      </div>

      <div className="mt-6 space-y-4">
        {top6.map((role, i) => (
          <motion.div
            key={role.name}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12.5px] font-medium text-ink">{role.name}</span>
              <span className="font-mono text-[12px] font-semibold" style={{ color: role.accent }}>
                {role.score}%
              </span>
            </div>
            <ScoreBar score={role.score} color={role.accent} delay={0.1 + i * 0.05} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Quick Actions ------------------------------ */

export function QuickActionsPanel({ analysisId }: { analysisId: string }) {
  return (
    <div className="panel p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker text-[10px] text-neutral-400">next steps</p>
          <h3 className="text-display mt-2 text-xl font-semibold text-ink">Take action now.</h3>
        </div>
        <Zap className="size-5 text-brand" strokeWidth={2} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          {
            icon: BookOpen,
            title: "Start Learning",
            desc: "Begin Week 1 of your roadmap",
            action: () => document.getElementById("learning-roadmap")?.scrollIntoView({ behavior: "smooth" }),
          },
          {
            icon: Award,
            title: "Get Certified",
            desc: "Explore recommended certifications",
            action: () => document.getElementById("certifications")?.scrollIntoView({ behavior: "smooth" }),
          },
        ].map((item) => (
          <button
            key={item.title}
            onClick={item.action}
            className="group flex items-center gap-3 rounded-xl border border-line bg-paper/50 p-4 text-left transition-all hover:border-brand/30 hover:bg-brand/[0.03]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-surface text-brand transition-transform group-hover:scale-105">
              <item.icon className="size-4" strokeWidth={2.2} />
            </span>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-ink group-hover:text-brand">{item.title}</p>
              <p className="text-[11px] text-neutral-500">{item.desc}</p>
            </div>
            <ArrowRight className="size-4 text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-brand" strokeWidth={2.2} />
          </button>
        ))}
      </div>
    </div>
  );
}
