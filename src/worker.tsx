import { env } from "cloudflare:workers";
import { RequestInfo } from "@redwoodjs/sdk/worker";
import { defineApp, ErrorResponse } from "@redwoodjs/sdk/worker";
import { route, render, prefix } from "@redwoodjs/sdk/router";
import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { Mashups } from "@/app/pages/mashups/Mashups";
import { Presets } from "@/app/pages/presets/Presets";
import { setCommonHeaders } from "@/app/headers";
import { userRoutes } from "@/app/pages/user/routes";
import { sessions, setupSessionStore } from "./session/store";
import { Session } from "./session/durableObject";
import { db, setupDb } from "./db";
import type { User } from "@prisma/client";
import { apiRoutes } from "@/app/api/routes";
import { mashupRoutes } from "@/app/pages/mashups/routes";
import { agentRoutes } from "@/app/agents/routes";

export { SessionDurableObject } from "./session/durableObject";
export { MashupAgent } from "@/app/agents/MashupAgent";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request, headers }) => {
    await setupDb(env);
    setupSessionStore(env);

    try {
      ctx.session = await sessions.load(request);
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

    if (ctx.session?.userId) {
      ctx.user = await db.user.findUnique({
        where: {
          id: ctx.session.userId,
        },
      });
    }
  },
  render(Document, [
    route("/", Mashups),
    route("/presets", Presets),
    prefix("/mashups", mashupRoutes),
    prefix("/user", userRoutes),
    prefix("/api", apiRoutes),
    prefix("/agents", agentRoutes),
    route("/protected", [
      ({ ctx }: RequestInfo) => {
        if (!ctx.user) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/user/login" },
          });
        }
      },
      Home,
    ]),
  ]),
]);
