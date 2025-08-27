CREATE TABLE "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system_role" text,
	"instruction" text,
	"constraints" jsonb DEFAULT '[]'::jsonb,
	"examples" jsonb DEFAULT '[]'::jsonb,
	"test_cases" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
