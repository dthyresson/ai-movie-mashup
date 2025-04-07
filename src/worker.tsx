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

export { SessionDurableObject } from "./session/durableObject";

export type AppContext = {
  session: Session | null;
  user: User | null;
  env: any;
};

export default defineApp<AppContext>([
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
