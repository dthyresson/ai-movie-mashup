import { route } from "@redwoodjs/sdk/router";
import { Mashup } from "@/app/pages/mashups/Mashup";
import { Mashups } from "@/app/pages/mashups/Mashups";
import { NewMashup } from "@/app/pages/mashups/NewMashup";

export const mashupRoutes = [
  route("/", Mashups),
  route("/new", NewMashup),
  route("/:id", Mashup),
];
