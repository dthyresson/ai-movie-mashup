// import { getMovie } from "@/app/pages/movies/functions";
import { db } from "@/db";

export async function getMovies() {
  return await db.movie.findMany({ orderBy: { title: "asc" } });
}

export async function getMovie(id: string) {
  return await db.movie.findUnique({ where: { id } });
}

export const getMoviesToMash = async (movie1: string, movie2: string) => {
  let movie1Data;
  let movie2Data;

  try {
    movie1Data = await getMovie(movie1);
  } catch (error) {
    console.error("Error getting movie 1", movie1, error);
    throw error;
  }
  try {
    movie2Data = await getMovie(movie2);
  } catch (error) {
    console.error("Error getting movie 2", movie2, error);
    throw error;
  }

  return { movie1Data, movie2Data };
};
