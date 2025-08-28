import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const prompts = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),

  systemRole: text("system_role"),

  instruction: text("instruction"),

  constraints: jsonb("constraints").default([]),

  examples: jsonb("examples").default([]),

  testCases: jsonb("test_cases").default([]),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
