import type { Connection } from "agents";
import { generateAudio } from "@/app/pages/mashups/functions";

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
