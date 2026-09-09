// Text cleaning — mirrors the "cleaning already done outside" step so users can
// paste raw resume text. Lowercases, normalizes punctuation, and removes stray
// symbols while preserving important technical tokens like c++, c#, .net and ci/cd.

export function cleanResumeText(raw: string): string {
  let t = raw.normalize("NFKC").toLowerCase();
  // Normalize smart quotes / dashes to plain characters.
  t = t.replace(/[’‘`]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, "-");
  // Drop every symbol except those meaningful for tech tokens: + # . - / &
  t = t.replace(/[^a-z0-9\s+#.\-/&']/g, " ");
  // Collapse runs of whitespace and stray separators.
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

const ESCAPE_RE = /[.*+?^${}()|[\]\\]/g;
// Left boundary also excludes "." so "js" inside "app.js" never matches, while the
// right boundary allows "." so sentence-ending periods (e.g. "…and git.") still match.
const LEFT_BOUNDARY = "[^a-z0-9+#.]";
const RIGHT_BOUNDARY = "[^a-z0-9+#]";
const regexCache = new Map<string, RegExp>();

/**
 * Build a symbol-aware matcher for a literal token. Unlike \b word boundaries,
 * this treats "+", "#" and "." as word characters so that "c++", "c#", ".net"
 * and "ci/cd" match exactly and "sql" does not match inside "mysql".
 */
export function tokenRegex(pattern: string): RegExp {
  const cached = regexCache.get(pattern);
  if (cached) return cached;
  const body = pattern.replace(ESCAPE_RE, "\\$&");
  const re = new RegExp(`(^|${LEFT_BOUNDARY})${body}(?=$|${RIGHT_BOUNDARY})`);
  regexCache.set(pattern, re);
  return re;
}

export function containsToken(cleanedText: string, pattern: string): boolean {
  return tokenRegex(pattern).test(cleanedText);
}
