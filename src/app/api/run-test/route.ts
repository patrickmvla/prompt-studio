import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { systemRole, instruction, examples, testInput } = await req.json();

    let fullPrompt = instruction;

    if (examples && examples.length > 0) {
      const exampleBlock = examples
        .map(
          (ex: { input: string; output: string }) =>
            `Input: ${ex.input}\nOutput: ${ex.output}`
        )
        .join("\n\n");
      fullPrompt += `\n\n--- Examples ---\n${exampleBlock}`;
    }

    fullPrompt += `\n\n--- Current Task ---\nInput: ${testInput}\nOutput:`;

    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemRole || "You are a helpful assistant.",
      },
      {
        role: "user",
        content: fullPrompt,
      },
    ];

    const stream = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    return new Response(stream.toReadableStream(), {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return new Response(JSON.stringify({ error: "Failed to run test" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
