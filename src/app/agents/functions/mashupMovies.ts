import { Connection } from "agents";
import { createWorkersAI } from "workers-ai-provider";
import { env } from "cloudflare:workers";
import { getMovie } from "@/app/pages/movies/functions";
import {
  getMashupPlotPrompt,
  getMashupTitlePrompt,
  getMashupTaglinePrompt,
} from "@/app/agents/functions/prompts";
import { db } from "@/db";
import { streamTextAndUpdateState } from "./streamTextAndUpdateState";
import { generatePoster } from "./generatePoster";
import { getPosterPrompt } from "./prompts";
import { generateAudioContent } from "./generateAudioContent";

import {
  TEXT_GENERATION_MODEL,
  IMAGE_GENERATION_MODEL,
  DEFAULT_GATEWAY_ID,
} from "./index";

const getMoviesToMash = async (movie1: string, movie2: string) => {
  const movie1Data = await getMovie(movie1);
  const movie2Data = await getMovie(movie2);

  return { movie1Data, movie2Data };
};

/**
 * Generate the title for the movie mashup
 */
const generateTitle = async (
  connection: Connection,
  model: any,
  movie1Data: any,
  movie2Data: any,
) => {
  const {
    systemPrompt: titleSystemPrompt,
    userPrompt: titleUserPrompt,
    assistantPrompt: titleAssistantPrompt,
  } = getMashupTitlePrompt(movie1Data, movie2Data);

  return await streamTextAndUpdateState(
    connection,
    model,
    titleSystemPrompt,
    titleUserPrompt,
    titleAssistantPrompt,
    "title",
    "",
  );
};

/**
 * Generate the tagline for the movie mashup
 */
const generateTagline = async (
  connection: Connection,
  model: any,
  title: string,
  movie1Data: any,
  movie2Data: any,
) => {
  const {
    systemPrompt: taglineSystemPrompt,
    userPrompt: taglineUserPrompt,
    assistantPrompt: taglineAssistantPrompt,
  } = getMashupTaglinePrompt(title, movie1Data, movie2Data);

  return await streamTextAndUpdateState(
    connection,
    model,
    taglineSystemPrompt,
    taglineUserPrompt,
    taglineAssistantPrompt,
    "tagline",
    "",
    512,
  );
};

/**
 * Generate the plot for the movie mashup
 */
const generatePlot = async (
  connection: Connection,
  model: any,
  title: string,
  tagline: string,
  movie1Data: any,
  movie2Data: any,
) => {
  const {
    systemPrompt: plotSystemPrompt,
    userPrompt: plotUserPrompt,
    assistantPrompt: plotAssistantPrompt,
  } = getMashupPlotPrompt(title, tagline, movie1Data, movie2Data);

  return await streamTextAndUpdateState(
    connection,
    model,
    plotSystemPrompt,
    plotUserPrompt,
    plotAssistantPrompt,
    "plot",
    "",
  );
};

/**
 * Generate poster and audio content for the movie mashup
 */
const generateMediaContent = async (
  connection: Connection,
  model: any,
  title: string,
  tagline: string,
  plot: string,
) => {
  return await Promise.all([
    generatePoster(connection, model, title, tagline, plot),
    generateAudioContent(connection, title, tagline, plot),
  ]);
};

/**
 * Create the mashup in the database
 */
const createMashupInDb = async (
  title: string,
  tagline: string,
  plot: string,
  imageKey: string,
  imageDescription: string,
  audioKey: string,
  movie1: string,
  movie2: string,
) => {
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
  return mashup;
};

/**
 * Function to pick movies and generate mashup content
 */
export const mashupMovies = async (
  connection: Connection,
  movie1: string,
  movie2: string,
) => {
  console.log("Mashing movies:", movie1, movie2);

  const DEFAULT_GATEWAY_ID = "default";

  const workersai = createWorkersAI({
    binding: env.AI,
    gateway: { id: DEFAULT_GATEWAY_ID },
  });
  const model = workersai(TEXT_GENERATION_MODEL, {
    safePrompt: true,
  });

  // Step 1: Find both movies
  const { movie1Data, movie2Data } = await getMoviesToMash(movie1, movie2);

  // If both movies are found, generate the mashup content
  if (movie1Data && movie2Data) {
    // Step 2: Generate title
    const title = await generateTitle(
      connection,
      model,
      movie1Data,
      movie2Data,
    );

    // Step 3: Generate tagline
    const tagline = await generateTagline(
      connection,
      model,
      title,
      movie1Data,
      movie2Data,
    );

    // Step 4: Generate plot
    const plot = await generatePlot(
      connection,
      model,
      title,
      tagline,
      movie1Data,
      movie2Data,
    );

    // Step 5: Generate poster and audio concurrently
    const [{ imageKey, imageDescription }, audioKey] =
      await generateMediaContent(connection, model, title, tagline, plot);

    // Step 6: Create the mashup and save to database
    const mashup = await createMashupInDb(
      title,
      tagline,
      plot,
      imageKey,
      imageDescription,
      audioKey,
      movie1,
      movie2,
    );

    return `created mashup: ${mashup.title}`;
  }
};

export async function generatePosterPrompt(
  title: string,
  tagline: string,
  plot: string,
) {
  const { systemPrompt, userPrompt, assistantPrompt } = getPosterPrompt(
    title,
    tagline,
    plot,
  );

  const imagePromptResult = (await env.AI.run(
    TEXT_GENERATION_MODEL,
    {
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: userPrompt,
        },
        {
          role: "assistant",
          content: assistantPrompt,
        },
      ],
      stream: false,
      max_tokens: 512,
    },
    {
      gateway: {
        id: DEFAULT_GATEWAY_ID,
      },
    },
  )) as unknown as {
    response: string;
  };

  return imagePromptResult.response;
}
