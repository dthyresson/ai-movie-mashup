import { defineApp, ErrorResponse } from "@redwoodjs/sdk/worker";
import { route, render, prefix } from "@redwoodjs/sdk/router";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { Mashups } from "@/app/pages/mashups/Mashups";
import { setCommonHeaders } from "@/app/headers";
import { userRoutes } from "@/app/pages/user/routes";
import { sessions, setupSessionStore } from "./session/store";
import { Session } from "./session/durableObject";
import { db, setupDb } from "./db";
import type { User } from "@prisma/client";
import { apiRoutes } from "./app/api/routes";
import { mashupRoutes } from "./app/pages/mashups/routes";
import { mashupMovies } from "./app/pages/mashups/functions";

export { SessionDurableObject } from "./session/durableObject";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

const app = defineApp<AppContext>([
  setCommonHeaders(),
  async ({ env, appContext, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);

    try {
      appContext.session = await sessions.load(request);
    } catch (error) {
      if (error instanceof ErrorResponse && error.code === 401) {
        await sessions.remove(request, headers);
        headers.set("Location", "/user/login");

        return new Response(null, {
          status: 302,
          headers,
        });
      }
      ``;
      throw error;
    }

    if (appContext.session?.userId) {
      appContext.user = await db.user.findUnique({
        where: {
          id: appContext.session.userId,
        },
      });
    }
  },
  render(Document, [
    route("/", Mashups),
    prefix("/mashups", mashupRoutes),
    route("/protected", [
      ({ appContext }) => {
        if (!appContext.user) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/user/login" },
          });
        }
      },
      Home,
    ]),
    prefix("/user", userRoutes),
    prefix("/api", apiRoutes),
  ]),
]);

export default {
  fetch: app.fetch,
  // Process the message queue
  async queue(batch, env) {
    for (const message of batch.messages) {
      console.log("handling message" + JSON.stringify(message));

      const { channel, id, firstMovieId, secondMovieId } = message.body as {
        channel: string;
        id: string;
        firstMovieId: string;
        secondMovieId: string;
      };

      // Process the new mashup message
      if (channel === "new-mashup") {
        try {
          // Process the mashup
          const mashup = await mashupMovies({
            id,
            firstMovieId,
            secondMovieId,
            env,
          });

          console.debug("updating mashup via Queue", mashup);

          // Update the existing mashup record and mark it as completed
          await db.mashup.update({
            where: { id },
            data: {
              status: "COMPLETED",
              title: mashup.title,
              tagline: mashup.tagline,
              plot: mashup.plot,
              imageKey: mashup.imageKey,
              audioKey: mashup.audioKey,
              imageDescription: mashup.imageDescription,
            },
          });
        } catch (error) {
          // Update the mashup and retry
          await db.mashup.update({
            where: { id },
            data: {
              status: "PENDING",
            },
          });

          message.retry();
        }
      }
    }
  },
} satisfies ExportedHandler<Env>;
