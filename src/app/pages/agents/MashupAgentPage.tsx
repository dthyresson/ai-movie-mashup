"use server";

import MashupAgentClient from "./MashupAgentClient";
export default function MashupAgentPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-neutral-800 mb-4">
        Mashup Movies via an AI Agent
      </h1>
      <MashupAgentClient />
    </div>
  );
}
