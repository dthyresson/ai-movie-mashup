import { defineLinks } from "@redwoodjs/sdk/router";

export const link = defineLinks([
  "/",
  "/mashups",
  "/mashups/page/:page",
  "/mashups/:id",
  "/mashups/new",
  "/mashups/new/:firstMovieId",
  "/mashups/new/:firstMovieId/:secondMovieId",
  "/mashups/random-mashup",
  "/presets",
  "/movies",
  "/movies/:id",
]);
