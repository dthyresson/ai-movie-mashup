import { createWorkersAI } from "workers-ai-provider";
import { env } from "cloudflare:workers";
import { getMovie } from "@/app/pages/movies/functions";
import {
  getMashupPlotPrompt,
  getMashupTitlePrompt,
  getMashupTaglinePrompt,
  getPosterPrompt,
} from "@/app/pages/mashups/prompts";
import { db } from "@/db";
import { generatePosterImage } from "@/app/pages/mashups/functions";
import { generateAudio } from "@/app/pages/mashups/functions";
import { streamText } from "ai";

/**
 * Function to pick movies and generate mashup content for workflow context
 * This version doesn't require a connection object
 */
export async function pickMoviesWorkflow(movie1: string, movie2: string) {
  console.log("Picking movies for workflow:", movie1, movie2);

  const workersai = createWorkersAI({ binding: env.AI });
  const model = workersai("@cf/meta/llama-3.1-8b-instruct", {
    safePrompt: true,
  });

  // Find both movies
  const movie1Data = await getMovie(movie1);
  const movie2Data = await getMovie(movie2);

  // If both movies are found, generate the mashup content
  if (movie1Data && movie2Data) {
    // Generate title
    const {
      systemPrompt: titleSystemPrompt,
      userPrompt: titleUserPrompt,
      assistantPrompt: titleAssistantPrompt,
    } = getMashupTitlePrompt(movie1Data, movie2Data);

    const title = await generateText(
      model,
      titleSystemPrompt,
      titleUserPrompt,
      titleAssistantPrompt,
    );

    // Generate tagline
    const {
      systemPrompt: taglineSystemPrompt,
      userPrompt: taglineUserPrompt,
      assistantPrompt: taglineAssistantPrompt,
    } = getMashupTaglinePrompt(title, movie1Data, movie2Data);

    const tagline = await generateText(
      model,
      taglineSystemPrompt,
      taglineUserPrompt,
      taglineAssistantPrompt,
      512,
    );

    // Generate plot
    const {
      systemPrompt: plotSystemPrompt,
      userPrompt: plotUserPrompt,
      assistantPrompt: plotAssistantPrompt,
    } = getMashupPlotPrompt(title, tagline, movie1Data, movie2Data);

    const plot = await generateText(
      model,
      plotSystemPrompt,
      plotUserPrompt,
      plotAssistantPrompt,
    );

    // Generate poster description
    const {
      systemPrompt: posterSystemPrompt,
      userPrompt: posterUserPrompt,
      assistantPrompt: posterAssistantPrompt,
    } = getPosterPrompt(title, tagline, plot);

    const imageDescription = await generateText(
      model,
      posterSystemPrompt,
      posterUserPrompt,
      posterAssistantPrompt,
      512,
    );

    // Generate the poster image and audio concurrently
    const [imageKey, audioKey] = await Promise.all([
      generatePosterImage(imageDescription),
      generateAudio(title, tagline, plot),
    ]);

    const mashup = await db.mashup.create({
      data: {
        title,
        tagline,
        plot,
        imageKey,
        imageDescription,
        audioKey,
        movie1: {
          connect: {
            id: movie1,
          },
        },
        movie2: {
          connect: {
            id: movie2,
          },
        },
        status: "COMPLETED",
      },
    });

    console.log(`created mashup: ${mashup.title}`);

    return {
      success: true,
      mashupId: mashup.id,
      title: mashup.title,
    };
  }

  return {
    success: false,
    error: "Failed to find one or both movies",
  };
}

/**
 * Helper function to generate text without streaming
 */
async function generateText(
  model: any,
  systemPrompt: string,
  userPrompt: string,
  assistantPrompt: string,
  maxTokens?: number,
): Promise<string> {
  const { textStream } = streamText({
    model,
    maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
      { role: "assistant", content: assistantPrompt },
    ],
  });

  let result = "";
  for await (const delta of textStream) {
    result += delta;
  }

  return result;
}
