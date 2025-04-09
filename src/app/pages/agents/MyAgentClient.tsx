"use client";
import { useAgent } from "agents/react";

export default function MyAgentClient() {
    const agent = useAgent({
        agent: "my-unique-agent-id",
        onMessage: (message) => {
            console.log("Message received:", message);
        }
    });

    const handleIncrement = async () => {
        console.log("Incrementing");
        await agent.send("increment");
    }
    return <div>
        <h2>MyAgentClient</h2>
        <p>Name: {agent.name}</p>
        <button onClick={() => handleIncrement()}>Increment</button>
    </div>;
}
