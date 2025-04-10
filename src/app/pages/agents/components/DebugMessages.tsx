"use client";

import type { MessageLog } from "./types";

interface DebugMessagesProps {
  messages: MessageLog[];
}

export const DebugMessages: React.FC<DebugMessagesProps> = ({ messages }) => {
  if (messages.length === 0) return null;

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>
      <div className="space-y-4 text-sm">
        {messages.map((message, index) => (
          <p key={index} className="text-gray-700">
            {JSON.stringify(message)}
          </p>
        ))}
      </div>
    </div>
  );
};
