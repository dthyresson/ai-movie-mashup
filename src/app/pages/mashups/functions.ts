// Note this is some duplicate code from that used by agent purely
// for legacy experminet with Q's
// Will be removed in future in favor of agents
"use server";

import { getMovie } from "../movies/functions";
import type { Movie } from "@prisma/client";
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
