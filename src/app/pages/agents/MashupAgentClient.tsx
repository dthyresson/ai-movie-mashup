"use client";

import { useState, useEffect } from "react";
import { useAgent } from "agents/react";
import { MovieSelector } from "./components/MovieSelector";
import { GenerateButton } from "./components/GenerateButton";
import { MashupResults } from "./components/MashupResults";
import { DebugMessages } from "./components/DebugMessages";
import type { MessageData, MessageLog } from "./components/types";

interface MashupAgentClientProps {
  firstMovieId?: string;
  secondMovieId?: string;
}

export default function MashupAgentClient({ firstMovieId, secondMovieId }: MashupAgentClientProps) {
  const [selectedMovie1, setSelectedMovie1] = useState<string | null>(null);
  const [selectedMovie2, setSelectedMovie2] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [tagline, setTagline] = useState<string | null>(null);
  const [plot, setPlot] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [audioKey, setAudioKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [showDebug, setShowDebug] = useState<boolean>(false);

  const updateStreamingState = (
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    newContent: string,
  ) => {
    setter((prev) => (prev ?? "") + newContent);
  };

  const resetMashup = () => {
    setTitle(null);
    setTagline(null);
    setPlot(null);
    setImageKey(null);
    setImageDescription(null);
    setAudioKey(null);
    setError(null);
    setMessages([]);
  };

  const agent = useAgent({
    agent: "mashup-agent",

    onOpen(event) {
      console.log("WebSocket connection opened", event);
    },
    onMessage: (message) => {
      try {
        if (!message.data) {
          console.warn("Empty message received");
          return;
        }

        let data: MessageData;
        try {
          data = JSON.parse(message.data);
        } catch (parseError) {
          const error = parseError as Error;
          console.error("Failed to parse message:", error, message.data);
          return;
        }

        if (data && typeof data === "object") {
          if (data.title) updateStreamingState(setTitle, data.title);
          if (data.tagline) updateStreamingState(setTagline, data.tagline);
          if (data.plot) updateStreamingState(setPlot, data.plot);
          if (data.imageKey) setImageKey(data.imageKey);
          if (data.imageDescription)
            updateStreamingState(setImageDescription, data.imageDescription);
          if (data.audioKey) setAudioKey(data.audioKey);
        }
        if (showDebug) {
          setMessages((prev) => [...prev, { raw: message.data, parsed: data }]);
        }
      } catch (error) {
        const e = error as Error;
        console.error("Error processing message:", e);
        setError(`Error processing message: ${e.message}`);
      }
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
      setError("Connection error. Please try again.");
      setIsGenerating(false);
    },
    onClose: () => {
      console.log("WebSocket connection closed");
      setIsGenerating(false);
    },
  });

  useEffect(() => {
    const hasAllData =
      title && tagline && plot && imageKey && imageDescription && audioKey;

    if (hasAllData) {
      console.log("All data received, setting isGenerating to false");
      setIsGenerating(false);
    }
  }, [title, tagline, plot, imageKey, imageDescription, audioKey]);

  useEffect(() => {
    // Auto-start mashup if both IDs are provided
    if (firstMovieId && secondMovieId) {
      setSelectedMovie1(firstMovieId);
      setSelectedMovie2(secondMovieId);
    }
  }, [firstMovieId, secondMovieId]);

  useEffect(() => {
    // Start mashup when both movies are selected and not already generating
    if (selectedMovie1 && selectedMovie2 && !isGenerating && !title) {
      handleGenerateMashup();
    }
  }, [selectedMovie1, selectedMovie2]);

  const handleGenerateMashup = async () => {
    if (!agent.id || !selectedMovie1 || !selectedMovie2) return;

    setIsGenerating(true);
    setError(null);
    resetMashup();
    setIsGenerating(true);

    // Reconnect the WebSocket if it's not already connected
    // if (agent.readyState === WebSocket.CLOSED) {
    //   agent.reconnect();
    // }

    agent.send(
      JSON.stringify({
        movie1: selectedMovie1,
        movie2: selectedMovie2,
      }),
    );
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="w-full mx-auto space-y-4">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <MovieSelector
                label="First Movie"
                selectedMovie={selectedMovie1}
                onSelect={setSelectedMovie1}
                otherSelectedMovie={selectedMovie2}
              />
              <MovieSelector
                label="Second Movie"
                selectedMovie={selectedMovie2}
                onSelect={setSelectedMovie2}
                otherSelectedMovie={selectedMovie1}
              />
            </div>
            <div className="w-full lg:w-auto flex justify-center lg:justify-end">
              <GenerateButton
                isLoading={isGenerating}
                onClick={handleGenerateMashup}
              />
            </div>
          </div>
        </div>

        <MashupResults
          title={title}
          tagline={tagline}
          plot={plot}
          imageKey={imageKey}
          imageDescription={imageDescription}
          audioKey={audioKey}
          isGenerating={isGenerating}
        />
      </div>

      {showDebug && <DebugMessages messages={messages} />}
    </div>
  );
}
