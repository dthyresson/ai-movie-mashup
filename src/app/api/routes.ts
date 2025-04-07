import { route } from "@redwoodjs/sdk/router";
import { mashupMovies } from "@/app/pages/mashups/functions";
import { db } from "@/db";

export const apiRoutes = [
  // Create a new mashup, but in a pending state before the job is queued
  // The queue job will update the mashup with the final details. See the worker.
  route("/mashup/:firstMovieId/:secondMovieId", async ({ params, env }) => {
    const firstMovieId = params.firstMovieId;
    const secondMovieId = params.secondMovieId;

    // Create a pending mashup record first
    const pendingMashup = await db.mashup.create({
      data: {
        movie1Id: firstMovieId,
        movie2Id: secondMovieId,
        status: "PENDING",
        title: "Processing...",
        tagline: "Processing...",
        plot: "Processing...",
        imageKey: "",
        imageDescription: "",
      },
    });

    // Queue the job
    await env.QUEUE.send({
      channel: "new-mashup",
      id: pendingMashup.id,
      firstMovieId,
      secondMovieId,
    });

    return new Response(JSON.stringify({ id: pendingMashup.id }), {
      status: 302, // Accepted
      headers: {
        "Content-Type": "application/json",
        Location: `/mashups/${pendingMashup.id}`,
      },
    });
  }),
  // Get a mashup by id and return the mashup details in JSON format
  route("/mashups/:id", async ({ params, env }) => {
    const id = params.id;
    const mashup = await db.mashup.findUnique({
      where: {
        id,
      },
      include: {
        movie1: true,
        movie2: true,
      },
    });

    return new Response(JSON.stringify(mashup), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
  // Get the poster for a mashup by id and return the poster image
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
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }),
  // Get the audio for a mashup by id and return the audio file
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
      headers: {
        "Content-Type": "audio/mp3",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }),
];
