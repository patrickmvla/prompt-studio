import { NextRequest, NextResponse } from "next/server";
import { getEncoding } from "js-tiktoken";

const JINA_API_KEY = process.env.JINA_API_KEY;
const JINA_API_URL = "https://api.jina.ai/v1/embeddings";
const MAX_TOKENS_PER_INPUT = 4000;
const encoding = getEncoding("cl100k_base");

// export const runtime = "edge";

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbeddings(texts: string[]): Promise<number[][]> {
  if (!JINA_API_KEY)
    throw new Error("JINA_API_KEY environment variable is not set.");

  const response = await fetch(JINA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JINA_API_KEY}`,
    },
    body: JSON.stringify({
      input: texts,
      model: "jina-embeddings-v2-base-en",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Jina API Error:", errorBody);
    throw new Error(`Jina API failed with status: ${response.status}`);
  }

  const data = await response.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.data.map((item: any) => item.embedding);
}

// Helper to truncate text to a max number of tokens using tiktoken
function truncateTextByTokens(text: string, maxTokens: number): string {
  const tokens = encoding.encode(text);
  if (tokens.length <= maxTokens) {
    return text;
  }

  const truncatedTokens = tokens.slice(0, maxTokens);

  return encoding.decode(truncatedTokens);
}

export async function POST(req: NextRequest) {
  try {
    const { actualOutput, expectedOutput } = await req.json();

    if (!actualOutput || !expectedOutput) {
      return NextResponse.json(
        { error: "Missing actualOutput or expectedOutput" },
        { status: 400 }
      );
    }

    const truncatedActual = truncateTextByTokens(
      actualOutput,
      MAX_TOKENS_PER_INPUT
    );
    const truncatedExpected = truncateTextByTokens(
      expectedOutput,
      MAX_TOKENS_PER_INPUT
    );

    const [actualEmbedding, expectedEmbedding] = await getEmbeddings([
      truncatedActual,
      truncatedExpected,
    ]);

    const similarity = cosineSimilarity(actualEmbedding, expectedEmbedding);

    return NextResponse.json({ similarity });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in check-similarity API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check similarity" },
      { status: 500 }
    );
  }
}
