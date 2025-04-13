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

/**
 * Retries a function with exponential backoff
 * @param fn The async function to retry
 * @param maxRetries Maximum number of retries
 * @param initialDelay Initial delay in milliseconds
 * @param maxDelay Maximum delay in milliseconds
 * @returns The result of the function if successful
 * @throws The last error if all retries fail
 */
export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1_300,
  maxDelay: number = 10_000,
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }

      // Calculate next delay with exponential backoff and jitter
      const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
      delay = Math.min(delay * 2 + jitter, maxDelay);
      retries++;

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
