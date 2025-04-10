import { Connection } from "agents";
import { streamText } from "ai";
import type { Mashup } from "@prisma/client";

/**
 * Helper function to stream text and update state
 */
export async function streamTextAndUpdateState(
  connection: Connection,
  model: any,
  systemPrompt: string,
  userPrompt: string,
  assistantPrompt: string,
  stateKey: keyof Mashup,
  initialValue: string = "",
  maxTokens?: number,
): Promise<string> {
  let result = initialValue;

  connection.send(result);

  const { textStream } = streamText({
    model,
    maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
      { role: "assistant", content: assistantPrompt },
    ],
  });

  for await (const delta of textStream) {
    const s = {
      [stateKey]: delta,
    };

    result += delta;

    connection.send(JSON.stringify(s));
  }

  return result;
}
