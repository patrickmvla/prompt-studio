import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

// This schema defines the structure for our "prompts" table in the Supabase database.
// It will store all the data related to a single prompt engineering session.
export const prompts = pgTable('prompts', {
  // A unique identifier for each prompt project, generated automatically.
  id: uuid('id').defaultRandom().primaryKey(),
  
  // The content of the "System Role" input in the editor.
  systemRole: text('system_role'),
  
  // The main instruction for the prompt.
  instruction: text('instruction'),
  
  // An array of constraints, stored as a JSON object for flexibility.
  constraints: jsonb('constraints').default([]),
  
  // An array of input/output examples, stored as a JSON object.
  examples: jsonb('examples').default([]),
  
  // An array of test cases, stored as a JSON object.
  testCases: jsonb('test_cases').default([]),

  // Timestamps for when the record was created and last updated.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
