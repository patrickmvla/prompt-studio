import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prompts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Zod schema for validating the incoming prompt data
const promptSchema = z.object({
  systemRole: z.string().optional(),
  instruction: z.string().optional(),
  constraints: z.array(z.any()).optional(),
  examples: z.array(z.any()).optional(),
  testCases: z.array(z.any()).optional(),
});

// API handler for creating a new prompt
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = promptSchema.parse(body);

    const [newPrompt] = await db
      .insert(prompts)
      .values(validatedData)
      .returning();

    return NextResponse.json(newPrompt);
  } catch (error) {
    console.error("Error creating prompt:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}

// API handler for updating an existing prompt
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Prompt ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = promptSchema.parse(body);

    const [updatedPrompt] = await db
      .update(prompts)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(prompts.id, id))
      .returning();

    if (!updatedPrompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPrompt);
  } catch (error) {
    console.error("Error updating prompt:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    );
  }
}
