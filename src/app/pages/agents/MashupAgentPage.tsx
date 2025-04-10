"use server";

import MashupAgentClient from "./MashupAgentClient";
export default function MashupAgentPage() {
  return (
    <div className="w-full mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <MashupAgentClient />
    </div>
  );
}
