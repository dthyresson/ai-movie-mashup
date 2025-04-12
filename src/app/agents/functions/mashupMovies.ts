import { Connection } from "agents";
import { createWorkersAI } from "workers-ai-provider";
import { env } from "cloudflare:workers";
import {
  TEXT_GENERATION_MODEL,
  DEFAULT_GATEWAY_ID,
  getMoviesToMash,
  generateTitle,
  generateTagline,
  generatePlot,
  generateMediaContent,
  createMashupInDb,
} from "./index";

/**
 * Function to pick movies and generate mashup content
 */
export const mashupMovies = async (
  connection: Connection,
  movie1: string,
  movie2: string,
) => {
  console.log("Mashing movies:", movie1, movie2);

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
