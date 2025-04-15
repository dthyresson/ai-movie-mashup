import { getTwoRandomMovies } from "@/app/pages/mashups/functions";

import { route } from "@redwoodjs/sdk/router";
import { Mashup } from "@/app/pages/mashups/Mashup";
import { Mashups } from "@/app/pages/mashups/Mashups";
import { NewMashup } from "@/app/pages/mashups/NewMashup";

export const mashupRoutes = [
  route("/", Mashups),
  route("/page/:page", Mashups),
  route("/new", NewMashup),
  route("/new/:firstMovieId", NewMashup),
  route("/new/:firstMovieId/:secondMovieId", NewMashup),
  route("/random-mashup", async () => {
    const { movie1, movie2 } = await getTwoRandomMovies();

    if (!movie1 || !movie2) {
      return new Response("Could not find random movies", { status: 404 });
    }

    return new Response(null, {
      status: 302, // Redirect
      headers: {
        Location: `/mashups/new/${movie1.id}/${movie2.id}`,
      },
    });
  }),
  route("/:id", Mashup),
];
