import { Connection } from "agents";
import { streamAndReturnCompleteText } from "./index";
import type { Movie } from "@prisma/client";

const getMashupTitlePrompt = (movie1: Movie, movie2: Movie) => {
  const systemPrompt = `
    You are a movie screenwriter.
    You are given two movies.
    You are to write a short, but engaging title for a mashup of the two movies.
    The mashup should be a new movie that is a fun, quirky combination of the two movies and their characters, plots, and settings.
    The mashup should be in the style of the two movies.

    Important:
    
    * Just return a new title
`;

  const userPrompt = `
    Movie 1: Title: ${movie1.title}
    Movie 1: Plot: ${movie1.overview}
    Movie 2: Title: ${movie2.title}
    Movie 2: Plot: ${movie2.overview}
    `;

  const assistantPrompt = `
    Always return a new title in plain text with no other text or formatting or quotes.
`;

  return { systemPrompt, userPrompt, assistantPrompt };
};

export const generateTitle = async (
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

  return await streamAndReturnCompleteText(
    connection,
    model,
    titleSystemPrompt,
    titleUserPrompt,
    titleAssistantPrompt,
    "title",
    "",
  );
};
