import { route } from "@redwoodjs/sdk/router";
import { Mashup } from "@/app/pages/mashups/Mashup";
import { Mashups } from "@/app/pages/mashups/Mashups";
import { NewMashup } from "@/app/pages/mashups/NewMashup";

export const mashupRoutes = [
  route("/", Mashups),
  route("/page/:page", Mashups),
  route("/view/:id", Mashup),
  route("/new", NewMashup),
  route("/new/:firstMovieId", NewMashup),
  route("/new/:firstMovieId/:secondMovieId", NewMashup),
];
