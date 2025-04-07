"use client";

import { useState, useEffect } from "react";
import { getMovie } from "@/app/pages/movies/functions";
import { Movie } from "@prisma/client";
import Spinner from "@/app/components/ui/Spinner";
export function NewMashupClient({ movies }: { movies: Movie[] }) {
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState<Movie[]>([]);
  const [isMashingUp, setIsMashingUp] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    const fetchSelectedMovies = async () => {
      if (selectedMovies.length > 0) {
        const movieDetails = await Promise.all(
          selectedMovies.map((id) => getMovie(id)),
        );
        setSelectedMovieDetails(movieDetails.filter(Boolean) as Movie[]);
      } else {
        setSelectedMovieDetails([]);
      }
    };

    fetchSelectedMovies();
  }, [selectedMovies]);

  const handleMovieClick = (movieId: string) => {
    setSelectedMovies((prev) => {
      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId);
      }
      if (prev.length >= 2) {
        return [prev[1], movieId];
      }
      return [...prev, movieId];
    });
  };

  const handleMashup = async () => {
    if (selectedMovies.length === 2) {
      setIsMashingUp(true);
      setLoadingMessageIndex(0);

      // Use window.location.href to trigger the redirect
      window.location.href = `/api/mashup/${selectedMovies[0]}/${selectedMovies[1]}`;
    }
  };

  const handleClearSelection = () => {
    setSelectedMovies([]);
  };

  return (
    <div className="py-8">
      {/* Selection Panel Header - Fixed at top */}
      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-lg mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedMovies.length === 0
              ? "Start by selecting first movie to mashup ..."
              : selectedMovies.length === 1
                ? "Pick one more movie to mashup ..."
                : "Mash it up!"}
          </h2>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              {selectedMovieDetails.length > 0 && (
                <p className="text-gray-600 mt-1 font-bold  ">
                  {selectedMovieDetails
                    .map((movie) => movie.title)
                    .filter(Boolean)
                    .join(" + ")}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {!isMashingUp && selectedMovies.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className=" px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Clear Selection
                </button>
              )}
              <button
                onClick={handleMashup}
                disabled={selectedMovies.length !== 2 || isMashingUp}
                className={`font-banner font-bold px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 ${
                  selectedMovies.length === 2 && !isMashingUp
                    ? "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                    : "bg-neutral-300 text-white cursor-not-allowed opacity-60"
                }`}
              >
                {isMashingUp ? "Mashing up..." : "Create Mashup"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Movie Grid */}
      {!isMashingUp && (
        <div className="h-[calc(100vh-300px)] overflow-y-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
            {movies?.map((movie) => (
              <li
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className={`bg-white rounded-lg shadow-md border overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
                  selectedMovies.includes(movie.id)
                    ? selectedMovies[0] === movie.id
                      ? "border-purple-500 ring-2 ring-purple-500"
                      : "border-fuchsia-500 ring-2 ring-fuchsia-500"
                    : "border-gray-200"
                }`}
              >
                <div className="aspect-[2/3] relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.photo}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {movie.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {movie.overview}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isMashingUp && (
        <div className="h-[calc(100vh-300px)] overflow-y-auto animate-pulse flex items-center justify-center">
          <p className="text-xl font-semibold text-neutral-700">
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl font-bold text-neutral-800 mb-2">
                {
                  [
                    "Generating mashup title, tagline, plot, poster and audio ...",
                    "Figuring out a great title...",
                    "Now crafting an awesome tagline...",
                    "Creating the perfect plot...",
                    "Making stunning poster art...",
                  ][loadingMessageIndex]
                }
              </p>
              <p className="text-lg text-neutral-600">
                This may take about 30 seconds
              </p>
              <div className="mt-2 text-neutral-600">
                <Spinner />
              </div>
            </div>
          </p>
        </div>
      )}
    </div>
  );
}
