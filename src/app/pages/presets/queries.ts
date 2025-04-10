"use server";

import { db } from "@/db";
import { PresetWithMovies } from "./types";

export async function getAllPresets(): Promise<PresetWithMovies[]> {
  return db.preset.findMany({
    include: {
      movie1: {
        select: {
          id: true,
          title: true,
          photo: true,
        },
      },
      movie2: {
        select: {
          id: true,
          title: true,
          photo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  }) as Promise<PresetWithMovies[]>;
}

export async function getFavoritePresets(
  limit: number = 3,
): Promise<PresetWithMovies[]> {
  return db.preset.findMany({
    include: {
      movie1: {
        select: {
          id: true,
          title: true,
          photo: true,
        },
      },
      movie2: {
        select: {
          id: true,
          title: true,
          photo: true,
        },
      },
    },
    where: {
      isFavorite: true,
    },
    take: limit,
    orderBy: {
      createdAt: "asc",
    },
  }) as Promise<PresetWithMovies[]>;
}
