"use client";

import { useState, useEffect, useRef } from "react";
import { useAgent } from "agents/react";
import { getMovies } from "@/app/pages/movies/functions";
import type { Movie } from "@prisma/client";

// MovieSelector component
interface MovieSelectorProps {
  label: string;
  selectedMovie: string | null;
  onSelect: (movieId: string) => void;
  otherSelectedMovie: string | null;
}

const MovieSelector: React.FC<MovieSelectorProps> = ({
  label,
  selectedMovie,
  onSelect,
  otherSelectedMovie,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const fetchedMovies = await getMovies();
      setMovies(fetchedMovies);
    };
    fetchMovies();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the selected movie object
  const selectedMovieObj = movies.find((movie) => movie.id === selectedMovie);

  // Filter out the movie that's already selected in the other dropdown
  const availableMovies = movies.filter(
    (movie) => !otherSelectedMovie || movie.id !== otherSelectedMovie,
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedMovieObj ? (
          <div className="flex items-center">
            <img
              src={`https://image.tmdb.org/t/p/w500/${selectedMovieObj.photo}`}
              alt={selectedMovieObj.title}
              className="size-6 shrink-0 rounded-sm mr-2"
            />
            <span>{selectedMovieObj.title}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select {label}</span>
        )}
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {availableMovies.map((movie) => (
            <div
              key={movie.id}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-purple-50"
              onClick={() => {
                onSelect(movie.id);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.photo}`}
                  alt={movie.title}
                  className="size-10 shrink-0 rounded-sm mr-2"
                />
                <span className="block truncate text-base font-medium">
                  {movie.title}
                </span>
              </div>

              {selectedMovie === movie.id && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-purple-600">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
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
        if (showDebug) {
          setMessages((prev) => [...prev, { raw: message.data, parsed: data }]);
        }

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

  // Add a useEffect to check if all data is received
  useEffect(() => {
    // Check if we have all the required data
    const hasAllData =
      title && tagline && plot && imageKey && imageDescription && audioKey;

    // If we have all the data, set isGenerating to false
    if (hasAllData) {
      console.log("All data received, setting isGenerating to false");
      setIsGenerating(false);
    }
  }, [title, tagline, plot, imageKey, imageDescription, audioKey]);

  // Add cleanup effect to properly close the WebSocket connection
  useEffect(() => {
    // This function will be called when the component unmounts
    return () => {
      console.log("Component unmounting, cleaning up WebSocket connection");
      if (agent && agent.close) {
        agent.close();
      }
    };
  }, [agent]);

  const handleGenerateMashup = async () => {
    if (!agent.id || !selectedMovie1 || !selectedMovie2) return;

    // Set generating state first
    setIsGenerating(true);
    setError(null);

    // Reset all other state
    resetMashup();

    // Keep isGenerating true after reset
    setIsGenerating(true);

    // It's time to start mashing!
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
                otherSelectedMovie={selectedMovie2}
              />
              <MovieSelector
                label="Second Movie"
                selectedMovie={selectedMovie2}
                onSelect={setSelectedMovie2}
                otherSelectedMovie={selectedMovie1}
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={handleGenerateMashup}
                disabled={!selectedMovie1 || !selectedMovie2 || isGenerating}
                className={`w-full max-w-xs py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                  !selectedMovie1 || !selectedMovie2
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isGenerating
                      ? "bg-purple-500 text-white cursor-wait"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {!selectedMovie1 || !selectedMovie2 ? (
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
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>
                    Pick Two Movies To Mashup!
                  </>
                ) : isGenerating ? (
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

        {/* Mashup Results Section - Only show when we have results or are generating with some content */}
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
              {audioKey && audioKey !== "" ? (
                <div className="mt-auto">
                  <audio
                    src={`/api/audio/${audioKey}`}
                    controls
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="mt-4 w-full bg-gray-100 p-2 rounded-lg flex items-center justify-center h-8">
                  <div className="text-center flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm">
                      Audio will generate after plot is written
                    </p>
                  </div>
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
                        AI will generate a poster when the design is complete
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
                      AI is writing your movie mashup ...
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
                <p className="text-gray-500 text-sm mt-2">
                  Once we know the mashup plot, we'll design a poster ...
                </p>
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
