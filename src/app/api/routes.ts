import { route } from "@redwoodjs/sdk/router";
import { mashupMovies } from "@/app/pages/mashups/functions";
import { db } from "@/db";

export const apiRoutes = [
  route("/mashup/:firstMovieId/:secondMovieId", async ({ params, env }) => {
    const firstMovieId = params.firstMovieId;
    const secondMovieId = params.secondMovieId;
    const mashup = await mashupMovies({ firstMovieId, secondMovieId, env });
    return new Response(JSON.stringify(mashup), {
      status: 302,
      headers: {
        "Content-Type": "application/json",
        Location: `/mashups/${mashup.id}`,
      },
    });
  }),
  route("/mashups/:id/poster", async ({ params, env }) => {
    const id = params.id;
    const mashup = await db.mashup.findUnique({
      where: {
        id,
      },
    });

    if (!mashup) {
      return new Response(null, {
        status: 404,
      });
    }

    const image = await env.R2.get(mashup.imageKey);

    if (!image) {
      return new Response(null, {
        status: 404,
      });
    }

    return new Response(image.body, {
      headers: { "Content-Type": "image/jpeg" },
    });
  }),
  route("/mashups/:id/audio", async ({ params, env }) => {
    const id = params.id;
    const mashup = await db.mashup.findUnique({
      where: {
        id,
      },
    });

    if (!mashup) {
      return new Response(null, {
        status: 404,
      });
    }

    if (!mashup.audioKey) {
      return new Response(null, {
        status: 404,
      });
    }

    const audio = await env.R2.get(mashup.audioKey);

    if (!audio) {
      return new Response(null, {
        status: 404,
      });
    }

    return new Response(audio.body, {
      headers: { "Content-Type": "audio/mp3" },
    });
  }),
];
