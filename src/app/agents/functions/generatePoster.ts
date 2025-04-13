import { Connection } from "agents";
import { streamAndReturnCompleteText } from "./helpers";
import { env } from "cloudflare:workers";
import {
  IMAGE_GENERATION_MODEL,
  DEFAULT_GATEWAY_ID,
  base64ToBlob,
} from "./index";
import { retryWithExponentialBackoff } from "./helpers";

const getPosterPrompt = (title: string, tagline: string, plot: string) => {
  const systemPrompt = `
    You are a movie art director and cinematographer.
    You are given a movie title, tagline, and plot.
    You are to describe a movie poster for the movie.
    The description should be a complelling and cinematic image that captures the genre of the movie.

    Important:
      * The description cannot contain violence, gore, or any other content that is not suitable for a movie poster.
      * Never include NSFW content.
      * Only return the description of the movie poster with no other text.
      * Include the title and tagline in the poster description if you think it is appropriate.
  `;

  const assistantPrompt = `
    Important:
      * The description must be 40 words or less.
      * Make sure the poster title is the provided title.
      * Make sure the poster tagline is the provided tagline.
  `;

  const userPrompt = `
    Title: ${title}
    Tagline: ${tagline}
    Plot: ${plot}
  `;

  return { systemPrompt, userPrompt, assistantPrompt };
};

// Function to generate the poster image
export async function generatePosterImage(prompt: string) {
  try {
    const { image } = await retryWithExponentialBackoff(
      async () => {
        return await env.AI.run(
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
      },
      3, // maxRetries
      1000, // initialDelay
      10000, // maxDelay
    );

    const contentType = "image/jpeg";
    const blob = base64ToBlob(image || "", contentType);

    // Upload to R2 bucket
    const savedImage = await retryWithExponentialBackoff(
      async () => {
        return await env.R2.put(`mashup-${Date.now()}.jpg`, blob, {
          httpMetadata: {
            contentType,
          },
        });
      },
      3,
      1000,
      10000,
    );

    return savedImage.key;
  } catch (error) {
    console.error("Error generating poster:", error);
    return "poster-error-key";
  }
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
    512,
  );

  // Generate the poster image
  const imageKey = await generatePosterImage(imageDescription);

  connection.send(JSON.stringify({ imageKey }));
  return { imageKey, imageDescription };
}
