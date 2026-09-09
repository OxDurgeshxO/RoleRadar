import { integer, jsonb, pgTable, serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import type { AnalysisReport } from "@/lib/types";

/** Manually verified target roles with their expected skills (canonical skill ids). */
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  description: text("description").notNull(),
  requiredSkills: jsonb("required_skills").$type<string[]>().notNull(),
  accent: varchar("accent", { length: 24 }).notNull().default("#c8f542"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Persisted analyses so students can revisit past reports. */
export const analyses = pgTable("analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeText: text("resume_text").notNull(),
  resumeExcerpt: text("resume_excerpt").notNull(),
  extractedSkills: jsonb("extracted_skills").$type<string[]>().notNull(),
  targetRole: varchar("target_role", { length: 120 }),
  result: jsonb("result").$type<AnalysisReport>().notNull(),
  topRole: varchar("top_role", { length: 120 }).notNull(),
  topScore: integer("top_score").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type RoleRow = typeof roles.$inferSelect;
export type AnalysisRow = typeof analyses.$inferSelect;
export type NewAnalysisRow = typeof analyses.$inferInsert;
