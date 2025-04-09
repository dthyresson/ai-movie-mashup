"use client";

import { useAgent } from "agents/react";
import { useState, useEffect } from "react";
import { getMovies } from "@/app/pages/movies/functions";
import { Movie } from "@prisma/client";

export default function MashupAgentClient() {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [plot, setPlot] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie1, setSelectedMovie1] = useState<string>("");
  const [selectedMovie2, setSelectedMovie2] = useState<string>("");
  const [audioKey, setAudioKey] = useState<string>("");
  useEffect(() => {
    setTitle("");
    setTagline("");
    setPlot("");
    setImageKey("");
    setImageDescription("");
    setAudioKey("");
    const fetchMovies = async () => {
      const movies = await getMovies();
      setMovies(movies);
    };
    fetchMovies();
  }, []);

  const agent = useAgent({
    agent: "mashup-agent",
    onMessage: (message) => {
      console.log("Message received:", message.data);
      setMessages((prev) => [...prev, message.data]);
    },
    onStateUpdate: (state: {
      title: string;
      tagline: string;
      plot: string;
      imageKey: string;
      imageDescription: string;
      audioKey: string;
    }) => {
      setTitle(state.title);
      setTagline(state.tagline);
      setPlot(state.plot);
      setImageKey(state.imageKey);
      setImageDescription(state.imageDescription);
      setAudioKey(state.audioKey);
    },
  });

  const handleMashup = async () => {
    setIsLoading(true);
    await agent.call("pickMovies", [selectedMovie1, selectedMovie2]);
    setIsLoading(false);
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <p className="text-gray-700 mb-2">
        Name: <span className="font-medium">{agent.name}</span>
      </p>

      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="flex flex-col gap-4">
          <select
            className="mb-4 p-2 border border-gray-300 rounded-md"
            onChange={(e) => setSelectedMovie1(e.target.value)}
          >
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
          <select
            className="mb-4 p-2 border border-gray-300 rounded-md"
            onChange={(e) => setSelectedMovie2(e.target.value)}
          >
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
          <div className="flex flex-row gap-4">
            <button
              onClick={async () => {
                await handleMashup();
              }}
              disabled={isLoading}
              className="mb-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Mashup!
            </button>

            <button
              className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              disabled={isLoading}
              onClick={() => {
                // clear the state
                setTitle("");
                setTagline("");
                setPlot("");
                setImageKey("");
                setImageDescription("");
                setAudioKey("");
              }}
            >
              Clear State
            </button>
          </div>
        </div>
        {audioKey && audioKey !== "" && (
          <div className="my-4">
            <audio src={`/api/audio/${audioKey}`} controls className="w-full" />
          </div>
        )}
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
        {imageKey != "" && (
          <p className="text-gray-700">
            <span className="font-semibold">Poster:</span>
            <img
              src={`/api/poster/${imageKey}`}
              alt="Mashup Poster"
              className="w-full h-auto"
            />
          </p>
        )}
      </div>

      <h3 className="text-xl font-semibold text-neutral-800 mb-3">Messages</h3>
      <ul className="bg-white rounded-md shadow divide-y divide-gray-100">
        {messages.map((message, index) => (
          <li key={index} className="px-4 py-3 text-gray-700">
            {message}
          </li>
        ))}
        {messages.length === 0 && (
          <li className="px-4 py-3 text-gray-500 italic">No messages yet</li>
        )}
      </ul>
    </div>
  );
}
