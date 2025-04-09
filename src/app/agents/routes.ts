import { route } from "@redwoodjs/sdk/router";
// import { Agent, getAgentByName, routeAgentRequest } from "agents";
import { routeAgentRequest } from "agents";

import { env } from "cloudflare:workers";
import { RequestInfo } from "@redwoodjs/sdk/worker";

import MashupAgentPage from "@/app/pages/agents/MashupAgentPage";

export const agentRoutes = [
  route("/mashup", MashupAgentPage),
  route("/*", async ({ request }: RequestInfo) => {
    // Automatically routes HTTP requests and/or WebSocket connections to /agents/:agent/:name
    // Best for: connecting React apps directly to Agents using useAgent from agents/react

    return (
      (await routeAgentRequest(request, env)) ||
      Response.json({ msg: "no agent here" }, { status: 404 })
    );

    // const agent = await getAgentByName<Env, MyAgent>(
    //   env.MY_AGENT,
    //   "my-unique-agent-id",
    // );
    // if (!agent) {
    //   return new Response("Agent not found", { status: 404 });
    // }

    // console.log("MyAgent agent", agent);

    // const response = await agent.onRequest(request);

    // return new Response(response.body, {
    //   status: response.status,
    //   headers: response.headers,
    // });
  }),
];
