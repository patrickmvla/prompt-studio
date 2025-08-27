import { NextRequest, NextResponse } from 'next/server';

// IMPORTANT: Make sure to set the JINA_API_KEY environment variable
const JINA_API_KEY = process.env.JINA_API_KEY;
const JINA_API_URL = 'https://api.jina.ai/v1/embeddings';

export const runtime = 'edge';

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must be of the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0; // Avoid division by zero
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Function to get embeddings from Jina AI
async function getEmbeddings(texts: string[]): Promise<number[][]> {
  if (!JINA_API_KEY) {
    throw new Error('JINA_API_KEY environment variable is not set.');
  }

  const response = await fetch(JINA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JINA_API_KEY}`,
    },
    body: JSON.stringify({
      input: texts,
      model: 'jina-embeddings-v2-base-en',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Jina API Error:', errorBody);
    throw new Error(`Jina API failed with status: ${response.status}`);
  }

  const data = await response.json();
  return data.data.map((item: any) => item.embedding);
}


export async function POST(req: NextRequest) {
  try {
    const { actualOutput, expectedOutput } = await req.json();

    if (!actualOutput || !expectedOutput) {
      return NextResponse.json({ error: 'Missing actualOutput or expectedOutput' }, { status: 400 });
    }

    // Get embeddings for both texts in a single API call
    const [actualEmbedding, expectedEmbedding] = await getEmbeddings([
      actualOutput,
      expectedOutput,
    ]);

    // Calculate cosine similarity between the two embeddings
    const similarity = cosineSimilarity(actualEmbedding, expectedEmbedding);

    return NextResponse.json({ similarity });

  } catch (error: any) {
    console.error('Error in check-similarity API:', error);
    return NextResponse.json({ error: error.message || 'Failed to check similarity' }, { status: 500 });
  }
}
