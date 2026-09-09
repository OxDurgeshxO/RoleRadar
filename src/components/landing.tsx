"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardCheck,
  FileText,
  FileUp,
  FlaskConical,
  LineChart,
  MessagesSquare,
  Route,
  ScanSearch,
  ShieldCheck,
  Sigma,
} from "lucide-react";
import type { RoleInput } from "@/lib/types";
import { Kicker, Reveal, ScoreBar, ScoreRing, SkillChip } from "./ui";

const DEMO_BARS = [
  { label: "machine learning", score: 100, tone: "present" as const },
  { label: "scikit-learn", score: 100, tone: "present" as const },
  { label: "fastapi", score: 50, tone: "partial" as const },
  { label: "docker", score: 0, tone: "missing" as const },
];

const MARQUEE_SKILLS = [
  "python", "sql", "pandas", "power bi", "react", "fastapi", "docker", "mlflow",
  "kubernetes", "nlp", "transformers", "excel", "node.js", "ci/cd", "tableau", "spark",
];

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_TEXT: Record<string, string> = { present: "have", partial: "part", missing: "gap" };
const STATUS_COLOR: Record<string, string> = { present: "#10b981", partial: "#f59e0b", missing: "#f43f5e" };

export function Landing({ roles }: { roles: RoleInput[] }) {
  return (
    <div>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-18 pb-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 shadow-[0_1px_2px_rgba(23,24,28,0.04)]"
          >
            <span className="size-1.5 rounded-full bg-brand" />
            <span className="kicker text-[10px] text-ink-soft">Career readiness · for students</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            className="text-display mt-6 text-[12.5vw] leading-[1.02] font-semibold text-ink sm:text-6xl lg:text-[72px]"
          >
            Know exactly where your resume <em className="text-brand not-italic italic">stands</em>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
            className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-soft"
          >
            RoleFit reads your resume, detects your skills with transparent rules, and scores you
            against {roles.length} curated job roles. Every gap becomes a step in a week-by-week
            learning plan — no black boxes, no guesswork, and nothing to install.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/analyze"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(23,24,28,0.5)] transition-all duration-200 hover:bg-brand hover:shadow-[0_10px_24px_-10px_rgba(62,79,224,0.6)]"
            >
              Analyze my resume
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
            <Link
              href="/analyze?sample=ml"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:border-neutral-300 hover:bg-neutral-50"
            >
              Try a sample resume
              <ArrowUpRight className="size-4 text-brand" strokeWidth={2.4} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 grid max-w-md grid-cols-3 gap-3 border-t border-line pt-6"
          >
            {[
              { v: `${roles.length}`, l: "verified job roles" },
              { v: "70+", l: "tracked skills" },
              { v: "100%", l: "transparent scoring" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-display text-2xl font-semibold text-ink">{s.v}</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-neutral-500">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* demo report card */}
        <motion.div
          initial={{ opacity: 0, y: 36, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="panel panel-hover relative overflow-hidden p-6 sm:p-7"
        >
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-brand/0 via-brand/30 to-brand/0" />
          <div className="flex items-center justify-between">
            <p className="kicker text-[10px] text-neutral-400">sample report · live preview</p>
            <ScanSearch className="size-4 text-brand" strokeWidth={2} />
          </div>

          <div className="mt-5 flex items-center gap-6">
            <ScoreRing score={72} size={128} stroke={9} sublabel="match score" />
            <div className="min-w-0">
              <p className="text-display text-lg leading-tight font-semibold text-ink">Machine Learning Engineer</p>
              <p className="mt-1.5 text-[12.5px] leading-snug text-neutral-500">
                Top match for the sample resume — production deployment skills are the main gap.
              </p>
              <div className="mt-3 flex gap-1.5">
                <SkillChip label="python" tone="present" />
                <SkillChip label="docker" tone="missing" />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-line-soft pt-5">
            {DEMO_BARS.map((b, i) => (
              <div key={b.label} className="flex items-center gap-3">
                <span className="w-28 shrink-0 font-mono text-[11px] text-ink-soft">{b.label}</span>
                <ScoreBar score={b.score} delay={0.35 + i * 0.12} color={STATUS_COLOR[b.tone]} />
                <span
                  className="w-10 shrink-0 text-right font-mono text-[10px] uppercase"
                  style={{ color: STATUS_COLOR[b.tone] }}
                >
                  {STATUS_TEXT[b.tone]}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-brand/15 bg-brand/[0.05] p-4">
            <p className="kicker text-[9px] text-brand">next up · week 1</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink">
              FastAPI REST API basics — wrap one of your existing ML models as a JSON endpoint.
            </p>
          </div>
        </motion.div>
      </section>

      {/* --------------------------- MARQUEE --------------------------- */}
      <section className="overflow-hidden border-y border-line bg-surface/70 py-4">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {[...MARQUEE_SKILLS, ...MARQUEE_SKILLS].map((s, i) => (
            <span key={i} className="flex items-center gap-10 font-mono text-[11px] tracking-[0.22em] text-neutral-400 uppercase">
              {s} <span className="text-brand">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ------------------------- HOW IT WORKS ------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <Kicker num="01">How it works</Kicker>
          <h2 className="text-display mt-4 max-w-lg text-4xl font-semibold text-ink sm:text-[44px]">
            From file to plan in three steps.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: FileUp,
              step: "Step 01",
              title: "Upload or paste",
              body: "Drop a PDF, DOCX or TXT file — text is extracted on our server and cleaned automatically, preserving technical tokens like c++, c# and .net.",
            },
            {
              icon: ScanSearch,
              step: "Step 02",
              title: "Skills are scored",
              body: "Each required skill is marked present, partial, or missing using documented keyword and synonym rules — every decision is inspectable.",
            },
            {
              icon: Route,
              step: "Step 03",
              title: "Follow your plan",
              body: "Top roles, a coverage matrix, an ATS readiness check, and a week-by-week roadmap built from exactly the skills you are missing.",
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className="panel panel-hover group h-full p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl border border-line bg-paper text-brand transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
                    <c.icon className="size-5" strokeWidth={2} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">{c.step}</span>
                </div>
                <h3 className="text-display mt-6 text-xl font-semibold text-ink">{c.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------- FEATURES --------------------------- */}
      <section className="border-y border-line bg-surface/60">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal>
            <Kicker num="02">Everything in the report</Kicker>
            <h2 className="text-display mt-4 max-w-xl text-4xl font-semibold text-ink sm:text-[44px]">
              Six tools that turn a resume into a plan.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ScanSearch,
                title: "Role match scoring",
                body: "Scores for 11 curated roles with present, partial, and missing skills explained one by one.",
              },
              {
                icon: ClipboardCheck,
                title: "ATS readiness check",
                body: "Eight resume best-practice checks — sections, contact info, action verbs, quantified impact — with fixes for each.",
              },
              {
                icon: FlaskConical,
                title: "What-if simulator",
                body: "Toggle skills you plan to learn and watch your projected match scores rise in real time.",
              },
              {
                icon: Route,
                title: "Learning roadmap",
                body: "A week-by-week plan with concrete topics and mini-projects, re-targetable to any role.",
              },
              {
                icon: MessagesSquare,
                title: "Interview preparation",
                body: "Role-specific questions generated from your strongest and weakest signals, ready to rehearse.",
              },
              {
                icon: LineChart,
                title: "Progress tracking",
                body: "Every report is saved — watch your scores improve as you add skills and projects over weeks.",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={Math.min(i * 0.06, 0.3)}>
                <div className="panel panel-hover h-full p-6">
                  <f.icon className="size-5 text-brand" strokeWidth={2} />
                  <h3 className="text-display mt-4 text-[17px] font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------- SCORING RULE ------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Kicker num="03">The scoring rule</Kicker>
            <h2 className="text-display mt-4 text-4xl font-semibold text-ink sm:text-[44px]">
              A formula you can check by hand.
            </h2>
            <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
              Instead of a hidden model, every role uses the same explicit rule. Present skills earn a
              full point, related-but-incomplete skills earn half, and gaps earn zero — nothing else
              influences the number.
            </p>
            <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
              It behaves like a skill-based cosine similarity between your resume and each role — a way
              to measure how similar two profiles are — while staying explainable down to the keyword.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="panel relative overflow-hidden p-8">
              <Sigma className="absolute top-6 right-6 size-5 text-brand/40" strokeWidth={1.8} />
              <p className="kicker text-[10px] text-neutral-400">match score formula</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-line bg-paper p-6 font-mono text-[15px] text-ink">
                <span className="text-brand">score</span>
                <span className="text-neutral-400">=</span>
                <div className="text-center">
                  <div className="border-b border-neutral-300 px-3 pb-1.5">
                    <span className="text-emerald-600">present</span>
                    <span className="text-neutral-400"> + </span>
                    <span className="text-neutral-500">0.5</span>
                    <span className="text-neutral-400"> × </span>
                    <span className="text-amber-600">partial</span>
                  </div>
                  <div className="px-3 pt-1.5">
                    <span className="text-rose-500">required</span>
                  </div>
                </div>
                <span className="text-neutral-400">×</span>
                <span className="font-semibold">100</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { k: "present", v: "full credit", c: "text-emerald-600" },
                  { k: "partial", v: "half credit", c: "text-amber-600" },
                  { k: "missing", v: "no credit", c: "text-rose-500" },
                ].map((x) => (
                  <div key={x.k} className="rounded-lg border border-line bg-paper px-2 py-3">
                    <p className={`font-mono text-[12px] ${x.c}`}>{x.k}</p>
                    <p className="mt-1 text-[11px] text-neutral-500">{x.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- ROLES GRID --------------------------- */}
      <section className="border-t border-line bg-surface/60">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Kicker num="04">Target roles</Kicker>
              <h2 className="text-display mt-4 text-4xl font-semibold text-ink sm:text-[44px]">
                {roles.length} roles, verified skill lists.
              </h2>
            </div>
            <Link href="/roles" className="group inline-flex items-center gap-2 text-sm font-medium text-brand">
              Browse the full catalog
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.4} />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.slice(0, 6).map((r, i) => (
              <Reveal key={r.name} delay={i * 0.06}>
                <Link href="/roles" className="panel panel-hover group block h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="size-2 rounded-full" style={{ background: r.accent }} />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase">{r.required.length} skills</span>
                  </div>
                  <h3 className="text-display mt-5 text-lg font-semibold text-ink transition-colors group-hover:text-brand">
                    {r.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-neutral-500">{r.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ CTA ------------------------------ */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center sm:px-12">
            <div className="absolute -top-24 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(62,79,224,0.35),transparent)]" />
            <div className="relative">
              <p className="kicker justify-center text-[10px] text-neutral-400">ready when you are</p>
              <h2 className="text-display mx-auto mt-4 max-w-2xl text-4xl font-semibold text-white sm:text-5xl">
                See your matches. Close your gaps.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-neutral-400">
                Upload your resume once and walk away with scores, an ATS check, interview questions,
                and a four-week plan.
              </p>
              <Link
                href="/analyze"
                className="group mt-9 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-deep"
              >
                Start the analysis
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-6 flex items-start gap-4 rounded-2xl border border-line bg-surface p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-brand/20 bg-brand/[0.06] text-brand">
              <ShieldCheck className="size-5" strokeWidth={2.2} />
            </span>
            <div>
              <h3 className="text-display text-[17px] font-semibold text-ink">Guidance, never a verdict.</h3>
              <p className="mt-1.5 max-w-3xl text-[13.5px] leading-relaxed text-ink-soft">
                RoleFit only evaluates skills, projects, education, and relevant experience. It never
                considers protected attributes, never makes hiring decisions, and every score is an
                estimate to review with a mentor, teacher, or recruiter.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
