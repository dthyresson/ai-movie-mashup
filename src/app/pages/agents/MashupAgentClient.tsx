"use client";

import { useState, useEffect } from "react";
import { useAgent } from "agents/react";
import { getMovies } from "@/app/pages/movies/functions";
import { Movie } from "@prisma/client";

// MovieSelector component
interface MovieSelectorProps {
  label: string;
  selectedMovie: string;
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
        value={selectedMovie}
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
  const [selectedMovie1, setSelectedMovie1] = useState<string>("");
  const [selectedMovie2, setSelectedMovie2] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [plot, setPlot] = useState<string>("");
  const [imageKey, setImageKey] = useState<string>("");
  const [imageDescription, setImageDescription] = useState<string>("");
  const [audioKey, setAudioKey] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageLog[]>([]);

  // Function to reset all mashup state
  const resetMashup = () => {
    setTitle("");
    setTagline("");
    setPlot("");
    setImageKey("");
    setImageDescription("");
    setAudioKey("");
    setError(null);
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
        if (data.title) setTitle((prev) => prev + data.title);
        if (data.tagline) setTagline((prev) => prev + data.tagline);
        if (data.plot) setPlot((prev) => prev + data.plot);
        if (data.imageKey) setImageKey(data.imageKey);
        if (data.imageDescription)
          setImageDescription((prev) => prev + data.imageDescription);
        if (data.audioKey) setAudioKey(data.audioKey);
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
      <div className="w-full max-w-4xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Select Movies</h2>
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
            <button
              onClick={handleGenerateMashup}
              disabled={!selectedMovie1 || !selectedMovie2 || isGenerating}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Creating Mashup..." : "Create New Mashup"}
            </button>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Mashup Details</h2>
            <div className="space-y-4">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Title:</span> {title}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Tagline:</span> {tagline}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Plot:</span> {plot}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Poster Description:</span>{" "}
                {imageDescription}
              </p>
              {imageKey ? (
                <div className="mt-4">
                  <img
                    src={`/api/poster/${imageKey}`}
                    alt={imageDescription}
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Poster:</span> No poster yet
                </p>
              )}
            </div>
          </div>
        </div>
        {audioKey && audioKey !== "" ? (
          <div className="my-4">
            <audio src={`/api/audio/${audioKey}`} controls className="w-full" />
          </div>
        ) : (
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Audio:</span> No audio yet
          </p>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <p key={index} className="text-gray-700">
              {JSON.stringify(message)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
