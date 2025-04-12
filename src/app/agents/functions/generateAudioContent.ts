import type { Connection } from "agents";
import { env } from "cloudflare:workers";
import { TTS_MODEL, DEFAULT_GATEWAY_ID, base64ToBlob } from "./index";

export async function generateAudio(
  title: string,
  tagline: string,
  plot: string,
) {
  const { audio } = (await env.AI.run(
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

  const contentType = "audio/mp3";
  const audioBlob = base64ToBlob(audio, contentType);

  // Upload to R2 bucket
  const savedAudio = await env.R2.put(`mashup-${Date.now()}.mp3`, audioBlob, {
    httpMetadata: {
      contentType,
    },
  });

  return savedAudio.key;
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
