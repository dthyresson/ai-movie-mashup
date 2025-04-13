import { Connection } from "agents";
import { streamText } from "ai";
import type { Mashup } from "@prisma/client";

// Helper function to convert base64 to binary blob
export function base64ToBlob(
  base64Data: string,
  type: string = "image/jpeg",
): Blob {
  const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
  return new Blob([binaryData], { type });
}

/**
 * Helper function to stream text and send it to the client
 *
 * call streamText with the model, systemPrompt, userPrompt, assistantPrompt
 * for each chunk of text, send it to the client via the connection object
 * return the complete result text so can save later in db
 */
export async function streamAndReturnCompleteText(
  connection: Connection,
  model: any,
  systemPrompt: string,
  userPrompt: string,
  assistantPrompt: string,
  stateKey: keyof Mashup,
  maxTokens: number = 512,
): Promise<string> {
  const { textStream, text } = streamText({
    model,
    maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
      { role: "assistant", content: assistantPrompt },
    ],
  });

  for await (const delta of textStream) {
    const chunk = {
      [stateKey]: delta,
    };

    connection.send(JSON.stringify(chunk));
  }

  return await text;
}
