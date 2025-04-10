import { defineLinks } from "@redwoodjs/sdk/router";

export const link = defineLinks([
  "/",
  "/mashups",
  "/mashups/new",
  "/mashups/:id",
  "/agents/mashup",
]);
