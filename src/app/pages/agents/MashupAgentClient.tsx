"use client";

import { useState, useEffect } from "react";
import { useAgent } from "agents/react";
import { getMovies } from "@/app/pages/movies/functions";
import { Movie } from "@prisma/client";

// MovieSelector component
interface MovieSelectorProps {
  label: string;
  selectedMovie: string | null;
  onSelect: (movieId: string) => void;
}

const MovieSelector: React.FC<MovieSelectorProps> = ({
  label,
  selectedMovie,
  onSelect,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const fetchedMovies = await getMovies();
      setMovies(fetchedMovies);
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        className="w-full p-2 border border-gray-300 rounded-md"
        value={selectedMovie || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select a movie</option>
        {movies.map((movie) => (
          <option key={movie.id} value={movie.id}>
            {movie.title}
          </option>
        ))}
      </select>
    </div>
  );
};

// Add this interface near the top of the file with other interfaces
interface MessageData {
  title?: string;
  tagline?: string;
  plot?: string;
  imageKey?: string;
  imageDescription?: string;
  audioKey?: string;
}

interface MessageLog {
  raw: string;
  parsed: MessageData;
}

export default function MashupAgentClient() {
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

  // Function to reset all mashup state
  const resetMashup = () => {
    setTitle(null);
    setTagline(null);
    setPlot(null);
    setImageKey(null);
    setImageDescription(null);
    setAudioKey(null);
    setError(null);
    setMessages([]);
    setIsGenerating(false);
  };

  const agent = useAgent({
    agent: "mashup-agent",
    onMessage: (message) => {
      // Log the raw message for debugging
      console.log("Raw message received:", message.data);

      try {
        // Skip empty messages
        if (!message.data) {
          console.warn("Empty message received");
          return;
        }

        // Try to parse the message
        let data: MessageData;
        try {
          data = JSON.parse(message.data);
        } catch (parseError) {
          const error = parseError as Error;
          console.error("Failed to parse message:", message.data);
          console.error("Parse error:", error);
          setError(`Failed to parse message: ${error.message}`);
          return;
        }

        // Validate the parsed data
        if (!data || typeof data !== "object") {
          console.warn("Invalid message format received:", data);
          return;
        }

        // Update messages state with the raw data for debugging
        setMessages((prev) => [...prev, { raw: message.data, parsed: data }]);

        // Process valid data fields
        if (data.title) setTitle((prev) => (prev || "") + data.title);
        if (data.tagline) setTagline((prev) => (prev || "") + data.tagline);
        if (data.plot) setPlot((prev) => (prev || "") + data.plot);
        if (data.imageKey) setImageKey(data.imageKey);
        if (data.imageDescription) {
          console.log("Received image description:", data.imageDescription);
          setImageDescription((prev) => {
            const newDesc = (prev || "") + data.imageDescription;
            console.log("Updated image description:", newDesc);
            return newDesc;
          });
        }
        if (data.audioKey) setAudioKey(data.audioKey);

        // If we have all the data, set isGenerating to false
        if (
          title &&
          tagline &&
          plot &&
          imageKey &&
          imageDescription &&
          audioKey
        ) {
          setIsGenerating(false);
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

  const handleGenerateMashup = async () => {
    if (!agent.id || !selectedMovie1 || !selectedMovie2) return;

    setIsGenerating(true);
    setError(null);
    // clear the state
    resetMashup();

    agent.send(
      JSON.stringify({
        movie1: selectedMovie1,
        movie2: selectedMovie2,
      }),
    );
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="w-full mx-auto space-y-8">
        {/* Movie Selection Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <MovieSelector
                label="First Movie"
                selectedMovie={selectedMovie1}
                onSelect={setSelectedMovie1}
              />
              <MovieSelector
                label="Second Movie"
                selectedMovie={selectedMovie2}
                onSelect={setSelectedMovie2}
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={handleGenerateMashup}
                disabled={!selectedMovie1 || !selectedMovie2 || isGenerating}
                className="w-full max-w-xs bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Mashup...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Create New Mashup
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mashup Results Section - Only show when generating or when we have results */}
        {(isGenerating ||
          title ||
          tagline ||
          plot ||
          imageKey ||
          imageDescription ||
          audioKey) && (
          <div className="font-screenwriter w-full mx-auto p-6 bg-purple-50 rounded-lg shadow-lg">
            <div className="text-center mb-8">
              {title ? (
                <h1 className="text-4xl font-bold text-neutral-800 mb-2">
                  {title || ""}
                </h1>
              ) : (
                <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
              )}
              {tagline ? (
                <h2 className="text-2xl italic text-gray-600 mb-4">
                  {tagline || ""}
                </h2>
              ) : (
                <div className="h-8 bg-gray-200 rounded-lg w-2/3 mx-auto mb-4 animate-pulse"></div>
              )}
              {audioKey && audioKey !== "" && (
                <div className="mt-auto">
                  <audio
                    src={`/api/audio/${audioKey}`}
                    controls
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Two-column layout for poster and plot */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
              {/* Left column: Poster - takes up 2/5 */}
              <div className="lg:col-span-2 flex flex-col items-center">
                {imageKey ? (
                  <div className="aspect-square rounded-lg overflow-hidden shadow-xl border-2 border-neutral-300">
                    <img
                      src={`/api/poster/${imageKey}`}
                      alt={imageDescription || "Movie poster"}
                      className="w-full h-full object-cover rounded-lg p-2"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg overflow-hidden shadow-xl border-2 border-neutral-300 bg-gray-100 flex items-center justify-center">
                    <div className="text-center p-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-500 font-medium">
                        Poster coming soon
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        AI will generate a unique movie poster based on the
                        final plot
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right column: Plot - takes up 3/5 */}
              <div className="lg:col-span-3 flex flex-col">
                {plot ? (
                  <p className="text-xl text-gray-900 leading-relaxed mb-6">
                    {plot || ""}
                  </p>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-700">
                        Plot Summary
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    <p className="text-gray-500 text-sm mt-4">
                      AI is crafting an exciting plot for your movie mashup...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Image Description - Full width below both columns */}
            {imageDescription ? (
              <div className="w-full bg-purple-100 p-4 rounded-lg">
                <p className="text-md text-neutral-500">{imageDescription}</p>
              </div>
            ) : (
              <div className="w-full bg-gray-100 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Debug Messages Section */}
      {showDebug && (
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
      )}
    </div>
  );
}
