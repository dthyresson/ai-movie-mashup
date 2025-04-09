import type { Movie } from "@prisma/client";

// Get a mashup prompt used to generate a new mashup title, tagline, and plot summary
export const getMashupPrompt = (movie1: Movie, movie2: Movie) => {
  const systemPrompt = `
    You are a movie screenwriter.
    You are given two movies.
    You are to write a mashup of the two movies.
    The mashup should be a new movie that is a fun, quirky combination of the two movies and their characters, plots, and settings.
    The mashup should be in the style of the two movies.

    Important:
    
    * Just return a new title, tagline, and mashup plot summary of the new movie.
    * The mashup summary should be 300 words or less.
`;

  const userPrompt = `
    Movie 1: Title: ${movie1.title}
    Movie 1: Plot: ${movie1.overview}
    Movie 2: Title: ${movie2.title}
    Movie 2: Plot: ${movie2.overview}
    `;

  const assistantPrompt = `
    Always return a new title, tagline, and mashup plot summary of the new movie in the following JSON format: 

    {
      title: string,
      tagline: string,
      plot: string
    }
`;

  return { systemPrompt, userPrompt, assistantPrompt };
};

// Get a mashup prompt used to generate a new mashup title
export const getMashupTitlePrompt = (movie1: Movie, movie2: Movie) => {
  const systemPrompt = `
    You are a movie screenwriter.
    You are given two movies.
    You are to write an enaging title for a mashup of the two movies.
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

// Get a mashup prompt used to generate a new mashup plot
export const getMashupPlotPrompt = (
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
    Always return a the plot summary in plain text with no other text or formatting or qu.
`;

  return { systemPrompt, userPrompt, assistantPrompt };
};

// Get a mashup prompt used to generate a new mashup tagline
export const getMashupTaglinePrompt = (
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

// Get a poster prompt used to generate a new poster description
export const getPosterPrompt = (
  title: string,
  tagline: string,
  plot: string,
) => {
  const systemPrompt = `
    You are a movie art director and cinematographer.
    You are given a movie title, tagline, and plot.
     You are to describe a movie poster for the movie.
     The description should be a complelling and cinematic image that captures the genre of the movie.

     Important:
      * Only return the description of the movie poster with no other text.
      * The description must be 40 words or less.
      * The description must be concise and to the point.
      * Include the title and tagline in the poster description.
  `;

  const assistantPrompt = `
    Notes:
      * If you include a poster title, make sure it is the provided title.
      * If you include a poster tagline, make sure it is the provided tagline.
  `;

  const userPrompt = `
    Title: ${title}
    Tagline: ${tagline}
    Plot: ${plot}
  `;

  console.debug(userPrompt, "The poster user prompt");
  console.debug(assistantPrompt, "The poster assistant prompt");
  console.debug(systemPrompt, "The poster system prompt");

  return { systemPrompt, userPrompt, assistantPrompt };
};
