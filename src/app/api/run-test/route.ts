import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';

// Initialize the Groq client
// IMPORTANT: Make sure to set the GROQ_API_KEY environment variable
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = 'edge';

// The main API handler for running a single test case
export async function POST(req: NextRequest) {
  try {
    const { systemRole, instruction, examples, testInput } = await req.json();

    // 1. Construct the full prompt from the parts
    let fullPrompt = instruction;

    // Add examples to the prompt if they exist
    if (examples && examples.length > 0) {
      const exampleBlock = examples
        .map((ex: { input: string; output: string; }) => `Input: ${ex.input}\nOutput: ${ex.output}`)
        .join('\n\n');
      fullPrompt += `\n\n--- Examples ---\n${exampleBlock}`;
    }

    // Add the final test input
    fullPrompt += `\n\n--- Current Task ---\nInput: ${testInput}\nOutput:`;

    // 2. Define the messages for the Groq API
    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemRole || 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: fullPrompt,
      },
    ];
    
    // 3. Call the Groq API and get a stream
    const stream = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    // 4. Return the stream directly to the client
    return new Response(stream.toReadableStream(), {
      headers: { 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error calling Groq API:', error);
    return new Response(JSON.stringify({ error: 'Failed to run test' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
