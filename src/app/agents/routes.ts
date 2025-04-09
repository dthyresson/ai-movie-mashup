import { route } from "@redwoodjs/sdk/router";
import { Agent, getAgentByName, AgentNamespace } from "agents";
import { MyAgent } from "./MyAgent";
import { env } from "cloudflare:workers";
import { RequestInfo } from "@redwoodjs/sdk/worker";
import MyAgentPage from "@/app/pages/agents/MyAgentPage";

export const agentRoutes = [
  route("/my", MyAgentPage),
  route("/test", async ({ request }: RequestInfo) => {
    const agent = await getAgentByName<Env, MyAgent>(
      env.MY_AGENT,
      "my-unique-agent-id",
    );
    if (!agent) {
      return new Response("Agent not found", { status: 404 });
    }

    console.log("MyAgent agent", agent);

    const response = await agent.onRequest(request);

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  }),
];
