import type { Connection } from "agents";
import { env } from "cloudflare:workers";
import { TTS_MODEL, DEFAULT_GATEWAY_ID } from "./index";

export async function generateAudio(
  title: string,
  tagline: string,
  plot: string,
) {
  const result = (await env.AI.run(
    TTS_MODEL,
    {
      prompt: `Now playing. ${title}. ${tagline}. ${plot}`,
    },
    {
      gateway: {
        id: DEFAULT_GATEWAY_ID,
      },
    },
  )) as unknown as { audio: string };

  // Convert base64 string to a Blob
  const base64Data = result.audio || "";
  const binaryData = atob(base64Data);
  const bytes = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    bytes[i] = binaryData.charCodeAt(i);
  }
  const audioBlob = new Blob([bytes], { type: "audio/mp3" });

  // Upload to R2 bucket
  const audioKey = await env.R2.put(`mashup-${Date.now()}.mp3`, audioBlob, {
    httpMetadata: {
      contentType: "audio/mp3",
    },
  });

  return audioKey.key;
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
