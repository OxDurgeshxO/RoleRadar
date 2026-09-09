// In-memory fallback analysis store with LRU eviction.
// Enables RoleFit to function 100% reliably in zero-database environments
// (local offline dev, preview deployments, Docker without Postgres, etc.)

import type { AnalysisReport, StoredAnalysis } from "./types";

export interface FallbackAnalysisRecord {
  id: string;
  createdAt: Date;
  resumeText: string;
  resumeExcerpt: string;
  extractedSkills: string[];
  targetRole: string | null;
  result: AnalysisReport;
  topRole: string;
  topScore: number;
}

class FallbackStore {
  private records = new Map<string, FallbackAnalysisRecord>();
  private maxItems = 100;

  set(record: FallbackAnalysisRecord): void {
    if (this.records.size >= this.maxItems) {
      const firstKey = this.records.keys().next().value;
      if (firstKey) this.records.delete(firstKey);
    }
    this.records.set(record.id, record);
  }

  get(id: string): FallbackAnalysisRecord | undefined {
    return this.records.get(id);
  }

  getAll(): FallbackAnalysisRecord[] {
    return Array.from(this.records.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  delete(id: string): boolean {
    return this.records.delete(id);
  }

  count(): number {
    return this.records.size;
  }
}

// Preserve store across Next.js dev server hot-reloads
const globalForStore = globalThis as unknown as {
  __rolefitFallbackStore?: FallbackStore;
};

export const fallbackStore =
  globalForStore.__rolefitFallbackStore ?? new FallbackStore();

if (process.env.NODE_ENV !== "production") {
  globalForStore.__rolefitFallbackStore = fallbackStore;
}
