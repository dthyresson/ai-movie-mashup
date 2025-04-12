import { Connection } from "agents";
import { streamAndReturnCompleteText } from "./index";
import type { Movie } from "@prisma/client";

const getMashupTaglinePrompt = (
  mashupTitle: string,
  movie1: Movie,
  movie2: Movie,
) => {
  const systemPrompt = `
    You are a movie screenwriter.
    You are given two movies, mashup title.
    You are to write an enaging tagline for a mashup of the two movies.
    The mashup should be a new movie that is a fun, quirky combination of the two movies and their characters, plots, and settings.
    The mashup should be in the style of the two movies.

    Important:
    
    * Just return a new tagline
    * The tagline should be 10 words or less appropriate for a movie poster.

    `;

  const userPrompt = `
    Mashup Title: ${mashupTitle}
    Movie 1: Title: ${movie1.title}
    Movie 1: Plot: ${movie1.overview}
    Movie 2: Title: ${movie2.title}
    Movie 2: Plot: ${movie2.overview}
    `;

  const assistantPrompt = `
    Always return a the plot summary in plain text with no other text or formatting or qu.
`;

  return { systemPrompt, userPrompt, assistantPrompt };
};

export const generateTagline = async (
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

  return await streamAndReturnCompleteText(
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
