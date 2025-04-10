import { defineLinks } from "@redwoodjs/sdk/router";

export const link = defineLinks([
  "/",
  "/mashups",
  "/mashups/page/:page",
  "/mashups/new",
  "/mashups/:id",
  "/agents/mashup",
  "/agents/mashup/:firstMovieId",
  "/agents/mashup/:firstMovieId/:secondMovieId",
  "/api/random-mashup",
]);
