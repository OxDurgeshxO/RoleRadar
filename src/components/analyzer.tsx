"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Braces,
  ChevronDown,
  CircleAlert,
  ClipboardPaste,
  FileText,
  FileUp,
  FlaskConical,
  Loader2,
  Route as RouteIcon,
  ScanSearch,
  Sparkles,
  X,
} from "lucide-react";
import { cleanResumeText } from "@/lib/clean";
import { extractSkillsFromCleaned } from "@/lib/extract";
import { skillLabel } from "@/lib/skills";
import { SAMPLE_RESUMES } from "@/lib/samples";
import { SkillChip } from "./ui";

interface RoleOption {
  name: string;
  required_count: number;
}

const MIN_CHARS = 40;
const MAX_UPLOAD = 5 * 1024 * 1024;

export function Analyzer({ initialSampleId }: { initialSampleId?: string | null }) {
  const router = useRouter();
  const initial = SAMPLE_RESUMES.find((s) => s.id === initialSampleId);
  const [text, setText] = useState(initial?.text ?? "");
  const [activeSample, setActiveSample] = useState<string | null>(initial?.id ?? null);
  const [targetRole, setTargetRole] = useState<string>("");
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [showCleaned, setShowCleaned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewSkills, setPreviewSkills] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // upload state
  const [parsing, setParsing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; chars: number; pages: number | null } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load role catalog for the target selector.
  useEffect(() => {
    fetch("/api/roles")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setRoles(d.roles ?? []))
      .catch(() => setRoles([]));
  }, []);

  // Debounced live extraction preview (same engine as the server).
  useEffect(() => {
    const t = setTimeout(() => {
      if (text.trim().length < MIN_CHARS) {
        setPreviewSkills([]);
        return;
      }
      setPreviewSkills(extractSkillsFromCleaned(cleanResumeText(text)));
    }, 200);
    return () => clearTimeout(t);
  }, [text]);

  useEffect(() => {
    if (loading) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading]);

  const cleanedPreview = useMemo(() => cleanResumeText(text).slice(0, 420), [text]);
  const charCount = text.length;
  const ready = charCount >= MIN_CHARS && !loading && !parsing;

  function pickSample(id: string) {
    const s = SAMPLE_RESUMES.find((x) => x.id === id);
    if (!s) return;
    setText(s.text);
    setActiveSample(id);
    setFileInfo(null);
    setError(null);
    setUploadError(null);
  }

  async function uploadFile(file: File) {
    setUploadError(null);
    if (file.size > MAX_UPLOAD) {
      setUploadError("File is larger than 5 MB — please upload a smaller resume.");
      return;
    }
    setParsing(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/parse-resume", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Could not read that file.");
      setText(data.text);
      setActiveSample(null);
      setFileInfo({ name: data.file_name, chars: data.chars, pages: data.pages ?? null });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function run() {
    if (!ready) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: text, target_role: targetRole || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Analysis failed.");
      router.push(`/results/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14 pb-24 sm:px-8">
      {/* header */}
      <div className="max-w-2xl">
        <p className="kicker flex items-center gap-2.5 text-neutral-400">
          <span className="text-brand">01</span>
          <span className="h-px w-6 bg-neutral-300" />
          <span className="text-ink-soft">the analyzer</span>
        </p>
        <h1 className="text-display mt-4 text-4xl font-semibold text-ink sm:text-5xl">
          Upload, paste, <em className="text-brand">analyze</em>.
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          Drop your resume file (PDF, DOCX or TXT) or paste plain text. RoleFit extracts the text,
          detects skills, scores {roles.length || "11"} job roles, and builds a learning roadmap from
          your gaps.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        {/* ------------------------- left: input ------------------------- */}
        <div className="panel p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="kicker text-[10px] text-neutral-400">resume input</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_RESUMES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => pickSample(s.id)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] transition-all duration-200 ${
                    activeSample === s.id
                      ? "border-brand/40 bg-brand/[0.07] text-brand"
                      : "border-line bg-paper text-ink-soft hover:border-neutral-300 hover:text-ink"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* --------------------- upload dropzone --------------------- */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) uploadFile(f);
            }}
            onClick={() => !parsing && fileInputRef.current?.click()}
            className={`group mt-4 flex cursor-pointer items-center gap-4 rounded-xl border border-dashed px-5 py-4 transition-all duration-300 ${
              dragOver
                ? "border-brand/60 bg-brand/[0.06]"
                : "border-neutral-300 bg-paper/60 hover:border-brand/40 hover:bg-brand/[0.03]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f);
              }}
            />
            <span
              className={`grid size-11 shrink-0 place-items-center rounded-xl border transition-all duration-300 ${
                dragOver ? "border-brand/40 bg-brand/10 text-brand" : "border-line bg-surface text-neutral-400 group-hover:text-brand"
              }`}
            >
              {parsing ? <Loader2 className="size-5 animate-spin" strokeWidth={2.2} /> : <FileUp className="size-5" strokeWidth={2} />}
            </span>
            <div className="min-w-0 flex-1">
              {parsing ? (
                <p className="text-[13.5px] font-medium text-ink">Extracting text from your file…</p>
              ) : fileInfo ? (
                <>
                  <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                    <FileText className="size-4 shrink-0 text-brand" strokeWidth={2.2} />
                    <span className="truncate">{fileInfo.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileInfo(null);
                        setText("");
                      }}
                      aria-label="Clear uploaded file"
                      className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                    >
                      <X className="size-3.5" strokeWidth={2.4} />
                    </button>
                  </p>
                  <p className="mt-0.5 text-[12px] text-neutral-500">
                    {fileInfo.chars.toLocaleString()} characters extracted
                    {fileInfo.pages ? ` · ${fileInfo.pages} page${fileInfo.pages > 1 ? "s" : ""}` : ""} — edit below if needed
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[13.5px] font-medium text-ink">
                    {dragOver ? "Release to upload" : "Drop your resume here, or click to browse"}
                  </p>
                  <p className="mt-0.5 text-[12px] text-neutral-500">PDF, DOCX or TXT · up to 5 MB · text is extracted on our server</p>
                </>
              )}
            </div>
          </div>
          {uploadError && (
            <p className="mt-2.5 flex items-center gap-1.5 text-[12px] text-rose-500">
              <CircleAlert className="size-3.5 shrink-0" strokeWidth={2.2} />
              {uploadError}
            </p>
          )}

          {/* divider */}
          <div className="mt-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">or paste text</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="relative mt-4">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setActiveSample(null);
                setFileInfo(null);
              }}
              placeholder={"Paste resume text here…\n\nEducation, skills, projects, internships — plain text works best."}
              spellCheck={false}
              className="min-h-[300px] w-full resize-y rounded-xl border border-line bg-surface p-4 font-mono text-[13px] leading-relaxed text-ink placeholder:text-neutral-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/10 focus:outline-none"
            />
            <div className="pointer-events-none absolute right-3 bottom-3 rounded-md border border-line bg-paper px-2 py-1 font-mono text-[10px] text-neutral-500">
              {charCount.toLocaleString()} chars
            </div>
          </div>

          {charCount > 0 && charCount < MIN_CHARS && (
            <p className="mt-2.5 flex items-center gap-1.5 text-[12px] text-amber-600">
              <CircleAlert className="size-3.5" strokeWidth={2.2} />
              Add at least {MIN_CHARS - charCount} more characters for a meaningful analysis.
            </p>
          )}

          {/* cleaned preview */}
          <button
            onClick={() => setShowCleaned((v) => !v)}
            className="mt-4 flex items-center gap-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:text-ink"
          >
            <Braces className="size-3.5 text-brand" strokeWidth={2.2} />
            Preview cleaned text
            <ChevronDown className={`size-3.5 transition-transform duration-300 ${showCleaned ? "rotate-180" : ""}`} strokeWidth={2.2} />
          </button>
          <AnimatePresence>
            {showCleaned && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="mt-3 rounded-xl border border-line bg-paper p-4 font-mono text-[11.5px] leading-relaxed break-words text-neutral-500">
                  {cleanedPreview || "—"}
                  {cleanedPreview.length >= 420 && " …"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* target role */}
          <div className="mt-5">
            <label className="kicker text-[10px] text-neutral-400">roadmap target — optional</label>
            <div className="relative mt-2">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full appearance-none rounded-xl border border-line bg-surface px-4 py-3 text-[13.5px] text-ink focus:border-brand/40 focus:ring-2 focus:ring-brand/10 focus:outline-none"
              >
                <option value="">Let the engine decide (top-scoring role)</option>
                {roles.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name} — {r.required_count} required skills
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-neutral-400" strokeWidth={2.2} />
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">
              The learning roadmap is built from the gaps of this role. Leave it blank to use your best match.
            </p>
          </div>

          {/* submit */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={run}
              disabled={!ready}
              className={`group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-200 ${
                ready
                  ? "bg-ink text-white shadow-[0_12px_28px_-12px_rgba(23,24,28,0.5)] hover:bg-brand hover:shadow-[0_12px_28px_-12px_rgba(62,79,224,0.6)]"
                  : "cursor-not-allowed bg-neutral-100 text-neutral-400"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" strokeWidth={2.5} />
                  Analyzing{elapsed > 1 ? ` · ${elapsed}s` : "…"}
                </>
              ) : (
                <>
                  <Sparkles className="size-4" strokeWidth={2.5} />
                  Run full analysis
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
                </>
              )}
            </button>
            {error && (
              <p className="flex items-center gap-1.5 text-[12.5px] text-rose-500">
                <CircleAlert className="size-3.5" strokeWidth={2.2} />
                {error}
              </p>
            )}
          </div>
        </div>

        {/* ----------------------- right: live preview ----------------------- */}
        <div className="space-y-5">
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <p className="kicker text-[10px] text-neutral-400">live extraction</p>
              <ScanSearch className="size-4 text-brand" strokeWidth={2} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-display text-5xl font-semibold text-ink">{previewSkills.length}</span>
              <span className="text-[12.5px] text-neutral-500">skills detected</span>
            </div>
            <div className="mt-4 flex min-h-[84px] flex-wrap content-start gap-1.5">
              {previewSkills.length === 0 ? (
                <p className="flex items-center gap-2 text-[12.5px] text-neutral-400">
                  <ClipboardPaste className="size-3.5" strokeWidth={2} />
                  Skills will appear here as you type…
                </p>
              ) : (
                previewSkills.map((id) => <SkillChip key={id} label={skillLabel(id)} tone="accent" />)
              )}
            </div>
            <p className="mt-4 border-t border-line-soft pt-4 text-[11.5px] leading-relaxed text-neutral-400">
              Same keyword + synonym rules the scoring engine uses — nothing hidden.
            </p>
          </div>

          <div className="panel p-6">
            <p className="kicker text-[10px] text-neutral-400">what you get</p>
            <ul className="mt-4 space-y-3.5">
              {[
                { icon: ScanSearch, t: "Match score for every role", d: "Present, partial, and missing skills per role." },
                { icon: FlaskConical, t: "Simulator + ATS check", d: "Preview future scores and fix resume structure gaps." },
                { icon: RouteIcon, t: "Week-by-week roadmap", d: "Concrete topics and mini-projects for your gaps." },
              ].map((x) => (
                <li key={x.t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-paper text-brand">
                    <x.icon className="size-3.5" strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">{x.t}</p>
                    <p className="text-[12px] text-neutral-500">{x.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
