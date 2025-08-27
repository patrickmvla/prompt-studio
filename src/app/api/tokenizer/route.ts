import { NextRequest, NextResponse } from "next/server";
import { encode } from "gpt-3-encoder";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input: text must be a string" },
        { status: 400 }
      );
    }

    const tokens = encode(text);
    const tokenCount = tokens.length;

    return NextResponse.json({ tokenCount });
  } catch (error) {
    console.error("Error tokenizing text:", error);
    return NextResponse.json(
      { error: "Failed to tokenize text" },
      { status: 500 }
    );
  }
}
