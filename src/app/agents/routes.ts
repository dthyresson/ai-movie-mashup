import { route } from "@redwoodjs/sdk/router";
import { routeAgentRequest } from "agents";

import { env } from "cloudflare:workers";
import { RequestInfo } from "@redwoodjs/sdk/worker";

export const agentRoutes = [
  route("/*", async ({ request }: RequestInfo) => {
    // Automatically routes HTTP requests and/or WebSocket connections to /agents/:agent/:name
    // Best for: connecting React apps directly to Agents using useAgent from agents/react
    // The MashupAgent is defined in the MashupAgent.ts file
    // Wrangler durable_objects config defines the agent name as MASHUP_AGENT and the class name as MashupAgent
    // So /agents/mashup-agent/default will route to the MashupAgent when an agent client
    // uses the `useAgent` hook for websockets updates

    return (
      (await routeAgentRequest(request, env)) ||
      Response.json({ msg: "no agent here" }, { status: 404 })
    );
  }),
];
