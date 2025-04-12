import { Connection } from "agents";
import { getPosterPrompt } from "@/app/agents/functions/prompts";
import { streamAndReturnCompleteText } from "./helpers";
import { env } from "cloudflare:workers";
import {
  IMAGE_GENERATION_MODEL,
  DEFAULT_GATEWAY_ID,
  base64ToBlob,
} from "./index";

// Function to generate the poster image
export async function generatePosterImage(prompt: string) {
  const { image } = await env.AI.run(
    IMAGE_GENERATION_MODEL,
    {
      prompt,
    },
    {
      gateway: {
        id: DEFAULT_GATEWAY_ID,
      },
    },
  );

  const contentType = "image/jpeg";
  const blob = base64ToBlob(image || "", contentType);

  // Upload to R2 bucket
  const savedImage = await env.R2.put(`mashup-${Date.now()}.jpg`, blob, {
    httpMetadata: {
      contentType,
    },
  });

  return savedImage.key;
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

  const imageDescription = await streamAndReturnCompleteText(
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
