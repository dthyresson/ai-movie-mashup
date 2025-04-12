import { defineLinks } from "@redwoodjs/sdk/router";

export const link = defineLinks([
  "/",
  "/mashups",
  "/mashups/page/:page",
  "/mashups/new",
  "/mashups/view/:id",
  "/mashups/new/:firstMovieId",
  "/mashups/new/:firstMovieId/:secondMovieId",
  "/mashups/random-mashup",
  "/presets",
]);
