import { getMovie } from "@/app/pages/movies/functions";

export const getMoviesToMash = async (movie1: string, movie2: string) => {
  const movie1Data = await getMovie(movie1);
  const movie2Data = await getMovie(movie2);

  return { movie1Data, movie2Data };
};
