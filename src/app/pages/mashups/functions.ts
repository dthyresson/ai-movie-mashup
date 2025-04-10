"use server";

import { getMovie } from "../movies/functions";
import type { Movie } from "@prisma/client";
import { db } from "@/db";
import {
  getMashupPrompt,
  getPosterPrompt,
  getMashupTitlePrompt,
  getMashupPlotPrompt,
  getMashupTaglinePrompt,
} from "./prompts";
import { env } from "cloudflare:workers";

import { createWorkersAI } from "workers-ai-provider";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

const TEXT_GENERATION_MODEL = "@cf/meta/llama-3.1-8b-instruct";
const IMAGE_GENERATION_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const TTS_MODEL = "@cf/myshell-ai/melotts";

const DEFAULT_GATEWAY_ID = "default";

// Function to generate the movie mashup plot, title, and tagline
export async function generateMashupContent(
  movie1Details: Movie,
  movie2Details: Movie,
) {
  const { systemPrompt, userPrompt, assistantPrompt } = getMashupPrompt(
    movie1Details,
    movie2Details,
  );

  const result = (await env.AI.run(
    TEXT_GENERATION_MODEL,
    {
      max_tokens: 512,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
        {
          role: "assistant",
          content: assistantPrompt,
        },
      ],
      stream: false,
      response_format: {
        type: "json_schema",
        json_schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            tagline: {
              type: "string",
            },
            plot: {
              type: "string",
            },
          },
          required: ["title", "tagline", "plot"],
        },
      },
    },
    {
      gateway: {
        id: DEFAULT_GATEWAY_ID,
      },
    },
  )) as unknown as {
    response: { title: string; tagline: string; plot: string };
  };

  return result.response;
}

// Function to generate the movie mashup title
export async function generateMashupTitle(
  movie1Details: Movie,
  movie2Details: Movie,
) {
  const { systemPrompt, userPrompt, assistantPrompt } = getMashupTitlePrompt(
    movie1Details,
    movie2Details,
  );

  const { response } = (await env.AI.run(
    TEXT_GENERATION_MODEL,
    {
      max_tokens: 512,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
        {
          role: "assistant",
          content: assistantPrompt,
        },
      ],
      stream: false,
    },
    {
      gateway: {
        id: DEFAULT_GATEWAY_ID,
      },
    },
  )) as unknown as {
    response: string;
  };

  return response;
}

// Function to generate the movie mashup plot
export async function generateMashupPlot(
  mashupTitle: string,
  mashupTagline: string,
  movie1Details: Movie,
  movie2Details: Movie,
) {
  const { systemPrompt, userPrompt, assistantPrompt } = getMashupPlotPrompt(
    mashupTitle,
    mashupTagline,
    movie1Details,
    movie2Details,
  );

  const workersai = createWorkersAI({ binding: env.AI });
  const model = workersai("@cf/meta/llama-3.1-8b-instruct", {
    safePrompt: true,
  });
  const stream = createStreamableValue("");

  const { textStream } = streamText({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
      {
        role: "assistant",
        content: assistantPrompt,
      },
    ],
  });

  for await (const delta of textStream) {
    stream.update(delta);
  }

  stream.done();

  return stream;
}

// Function to generate the movie mashup tagline
export async function generateMashupTagline(
  mashupTitle: string,
  movie1Details: Movie,
  movie2Details: Movie,
) {
  const { systemPrompt, userPrompt, assistantPrompt } = getMashupTaglinePrompt(
    mashupTitle,
    movie1Details,
    movie2Details,
  );

  const { response } = (await env.AI.run(
    TEXT_GENERATION_MODEL,
    {
      max_tokens: 512,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
        {
          role: "assistant",
          content: assistantPrompt,
        },
      ],
      stream: false,
    },
    {
      gateway: {
        id: DEFAULT_GATEWAY_ID,
      },
    },
  )) as unknown as {
    response: string;
  };

  return response;
}

// Function to generate the poster image prompt
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

  console.debug(imagePromptResult.response, "The image prompt result");
  return imagePromptResult.response;
}

// Function to generate the poster image
export async function generatePosterImage(prompt: string) {
  const response = await env.AI.run(
    IMAGE_GENERATION_MODEL,
    {
      prompt: prompt,
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

export async function mashupMovies({
  id,
  firstMovieId,
  secondMovieId,
}: {
  id: string;
  firstMovieId: string;
  secondMovieId: string;
}) {
  const movie1Details = await getMovie(firstMovieId);
  const movie2Details = await getMovie(secondMovieId);
  console.debug(movie1Details, movie2Details, "The movie details to mashup");

  if (!movie1Details || !movie2Details) {
    throw new Error("One or both movies not found");
  }

  // Generate the mashup content (title, tagline, plot)
  const { title, tagline, plot } = await generateMashupContent(
    movie1Details,
    movie2Details,
  );

  // Generate the poster image prompt
  const posterDescription = await generatePosterPrompt(title, tagline, plot);

  // Generate the poster image
  const imageKey = await generatePosterImage(posterDescription);

  const audioKey = await generateAudio(title, tagline, plot);

  console.debug({ title, tagline, plot }, "The AI response");

  // Save the mashup to the database
  const mashup = await db.mashup.update({
    where: { id: id },
    data: {
      title,
      tagline,
      plot,
      imageKey,
      imageDescription: posterDescription,
      audioKey,
      movie1Id: firstMovieId,
      movie2Id: secondMovieId,
    },
    include: {
      movie1: true,
      movie2: true,
    },
  });

  return mashup;
}

export async function getMashups() {
  const mashups = await db.mashup.findMany({
    where: {
      status: {
        equals: "COMPLETED",
      },
    },
    include: {
      movie1: true,
      movie2: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return mashups;
}

export async function getMashupById(id: string) {
  const mashup = await db.mashup.findUnique({
    where: {
      id,
    },
    include: {
      movie1: true,
      movie2: true,
    },
  });

  return mashup;
}
