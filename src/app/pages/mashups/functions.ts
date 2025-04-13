"use server";

import { db } from "@/db";

export const MASHUPS_PER_PAGE = 9;

export async function getMashups(
  page: number = 1,
  pageSize: number = MASHUPS_PER_PAGE,
) {
  const skip = (page - 1) * pageSize;

  const [mashups, total] = await Promise.all([
    db.mashup.findMany({
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
      skip,
      take: pageSize,
    }),
    db.mashup.count({
      where: {
        status: {
          equals: "COMPLETED",
        },
      },
    }),
  ]);

  return {
    mashups,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  };
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

export async function getMovies() {
  return await db.movie.findMany({ orderBy: { title: "asc" } });
}

export async function getMovie(id: string) {
  return await db.movie.findUnique({ where: { id } });
}

export async function getTwoRandomMovies() {
  const totalMovies = await db.movie.count();

  const movie1 = await db.movie.findFirst({
    orderBy: { title: "asc" },
    skip: Math.floor(Math.random() * totalMovies),
  });

  if (!movie1) return { movie1: null, movie2: null };

  const movie2 = await db.movie.findFirst({
    where: { id: { not: movie1.id } },
    orderBy: { title: "asc" },
    skip: Math.floor(Math.random() * (totalMovies - 1)),
  });

  return { movie1, movie2 };
}
