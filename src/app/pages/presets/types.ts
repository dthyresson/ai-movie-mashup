import { Preset, Movie } from "@prisma/client";

export type PresetWithMovies = Preset & {
  movie1: Pick<Movie, "id" | "title" | "photo">;
  movie2: Pick<Movie, "id" | "title" | "photo">;
};
