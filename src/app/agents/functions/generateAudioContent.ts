import type { Connection } from "agents";
import { env } from "cloudflare:workers";
import {
  TTS_MODEL,
  DEFAULT_GATEWAY_ID,
  base64ToBlob,
  retryWithExponentialBackoff,
} from "./index";

export async function generateAudio(
  title: string,
  tagline: string,
  plot: string,
) {
  try {
    const { audio } = await retryWithExponentialBackoff(
      async () => {
        const result = await env.AI.run(
          TTS_MODEL,
          {
            prompt: `Now playing. ${title}. ${tagline}. ${plot}`,
          },
          {
            gateway: {
              id: DEFAULT_GATEWAY_ID,
            },
          },
        );
        return result as unknown as { audio: string };
      },
      3, // maxRetries
      1000, // initialDelay
      10000, // maxDelay
    );

    const contentType = "audio/mp3";
    const audioBlob = base64ToBlob(audio, contentType);

    // Upload to R2 bucket
    const savedAudio = await retryWithExponentialBackoff(
      async () => {
        return await env.R2.put(`mashup-${Date.now()}.mp3`, audioBlob, {
          httpMetadata: {
            contentType,
          },
        });
      },
      3,
      1000,
      10000,
    );

    return savedAudio.key;
  } catch (error) {
    console.error("Error generating audio:", error);
    return "audio-error-key";
  }
}

/**
 * Helper function to generate audio
 */
export async function generateAudioContent(
  connection: Connection,
  title: string,
  tagline: string,
  plot: string,
): Promise<string> {
  const audioKey = await generateAudio(title, tagline, plot);

  connection.send(JSON.stringify({ audioKey }));

  return audioKey;
}
