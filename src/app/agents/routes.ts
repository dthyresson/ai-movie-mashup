import { route } from "@redwoodjs/sdk/router";
import { Agent, getAgentByName, AgentNamespace } from "agents";
import { MyAgent } from "./MyAgent";
import { env } from "cloudflare:workers";

interface Env {
  // Define your Agent on the environment here
  // Passing your Agent class as a TypeScript type parameter allows you to call
  // methods defined on your Agent.
  MyAgent: AgentNamespace<MyAgent>;
}

export const agentRoutes = [
  route("/my", () => {
    const agent = getAgentByName<Env, MyAgent>(
      env.MyAgent,
      "my-unique-agent-id",
    );
    if (!agent) {
      return new Response("Agent not found", { status: 404 });
    }
    return agent.onRequest(request);
  }),
];
