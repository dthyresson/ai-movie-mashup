import { Connection } from "agents";
import { generatePosterImage } from "@/app/pages/mashups/functions";
import { getPosterPrompt } from "@/app/pages/mashups/prompts";
import { streamTextAndUpdateState } from "./streamTextAndUpdateState";

/**
 * Helper function to generate poster image
 */
export async function generatePoster(
  connection: Connection,
  model: any,
  title: string,
  tagline: string,
  plot: string,
): Promise<{ imageKey: string; imageDescription: string }> {
  // Generate poster description
  const {
    systemPrompt: posterSystemPrompt,
    userPrompt: posterUserPrompt,
    assistantPrompt: posterAssistantPrompt,
  } = getPosterPrompt(title, tagline, plot);

  const imageDescription = await streamTextAndUpdateState(
    connection,
    model,
    posterSystemPrompt,
    posterUserPrompt,
    posterAssistantPrompt,
    "imageDescription",
    "",
    512,
  );

  // Generate the poster image
  const imageKey = await generatePosterImage(imageDescription);

  connection.send(JSON.stringify({ imageKey }));
  return { imageKey, imageDescription };
}
