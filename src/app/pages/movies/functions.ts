"use server";

import { db } from "@/db";

export async function getMovies() {
  return await db.movie.findMany({ orderBy: { title: "asc" } });
}

export async function getMovie(id: string) {
  return await db.movie.findUnique({ where: { id } });
}

export async function mashupMovies(movie1: string, movie2: string) {
  const movie1Details = await getMovie(movie1);
  const movie2Details = await getMovie(movie2);

  if (!movie1Details || !movie2Details) {
    throw new Error("One or both movies not found");
  }

  console.debug(movie1Details, movie2Details, "The movie details to mashup");

  return {
    movie1: movie1Details,
    movie2: movie2Details,
  };
}
