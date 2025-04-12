import { Connection } from "agents";
import { streamAndReturnCompleteText } from "./index";
import type { Movie } from "@prisma/client";

const getMashupPlotPrompt = (
  mashupTitle: string,
  mashupTagline: string,
  movie1: Movie,
  movie2: Movie,
) => {
  const systemPrompt = `
    You are a movie screenwriter.
    You are given two movies, a mashup title and tagline.
    You are to write an enaging plot summary for a mashup of the two movies that matches the title and tagline.
    The mashup should be a new movie that is a fun, quirky combination of the two movies and their characters, plots, and settings.
    The mashup should be in the style of the two movies.
    The plot summary should be 300 words or less and should be a single paragraph.
    The plot summary should be able to be read in less than 20 seconds.

    Important:
    
    * Just return a new plot summary
`;

  const userPrompt = `
    Mashup Title: ${mashupTitle}
    Movie 1: Title: ${movie1.title}
    Movie 1: Plot: ${movie1.overview}
    Movie 2: Title: ${movie2.title}
    Movie 2: Plot: ${movie2.overview}
    `;

  const assistantPrompt = `
    Always return a the plot summary in plain text with no other text or formatting or quotation marks around the plot summary.
`;

  return { systemPrompt, userPrompt, assistantPrompt };
};

export const generatePlot = async (
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

  return await streamAndReturnCompleteText(
    connection,
    model,
    plotSystemPrompt,
    plotUserPrompt,
    plotAssistantPrompt,
    "plot",
    "",
  );
};
