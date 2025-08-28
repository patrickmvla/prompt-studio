import { NextRequest, NextResponse } from "next/server";
import { getEncoding } from "js-tiktoken";

const encoding = getEncoding("cl100k_base");

// export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input: text must be a string" },
        { status: 400 }
      );
    }

    const tokens = encoding.encode(text);
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
