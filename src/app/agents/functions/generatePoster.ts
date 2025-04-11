import { Connection } from "agents";
import { getPosterPrompt } from "@/app/agents/functions/prompts";
import { streamTextAndUpdateState } from "./streamTextAndUpdateState";
import { env } from "cloudflare:workers";
import { IMAGE_GENERATION_MODEL, DEFAULT_GATEWAY_ID } from "./index";

// Function to generate the poster image
export async function generatePosterImage(prompt: string) {
  const response = await env.AI.run(
    IMAGE_GENERATION_MODEL,
    {
      prompt: `${prompt}.`,
    },
    {
      gateway: {
        id: DEFAULT_GATEWAY_ID,
      },
    },
  );

  // Convert base64 string to a Blob/File for R2 storage
  const base64Data = response.image || "";
  const binaryData = atob(base64Data);
  const bytes = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    bytes[i] = binaryData.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: "image/jpeg" });

  // Upload to R2 bucket
  const image = await env.R2.put(`mashup-${Date.now()}.jpg`, blob, {
    httpMetadata: {
      contentType: "image/jpeg",
    },
  });

  return image.key;
}

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
