"use server";

import { db } from "@/db";

export async function getMovies() {
  return await db.movie.findMany({ orderBy: { title: "asc" } });
}

export async function getMovie(id: string) {
  return await db.movie.findUnique({ where: { id } });
}

export async function getTwoRandomMovies() {
  const totalMovies = await db.movie.count();

  const movie1 = await db.movie.findFirst({
    orderBy: { title: 'asc' },
    skip: Math.floor(Math.random() * totalMovies),
  });

  if (!movie1) return { movie1: null, movie2: null };

  const movie2 = await db.movie.findFirst({
    where: { id: { not: movie1.id } },
    orderBy: { title: 'asc' },
    skip: Math.floor(Math.random() * (totalMovies - 1)),
  });

  return { movie1, movie2 };
}
