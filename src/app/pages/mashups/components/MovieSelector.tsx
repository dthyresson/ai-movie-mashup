"use client";

import { useState, useEffect, useRef } from "react";
import type { Movie } from "@prisma/client";
import { ChevronDownIcon, CheckIcon } from "./icons";

interface MovieSelectorProps {
  label: string;
  selectedMovie: string | null;
  onSelect: (movieId: string) => void;
  otherSelectedMovie: string | null;
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
}

export const MovieSelector: React.FC<MovieSelectorProps> = ({
  label,
  selectedMovie,
  onSelect,
  otherSelectedMovie,
  movies,
  isLoading,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedMovieObj = movies.find((movie) => movie.id === selectedMovie);
  const availableMovies = movies.filter(
    (movie) => !otherSelectedMovie || movie.id !== otherSelectedMovie,
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="font-banner block text-sm font-medium text-gray-700 mb-1">
        {label === "First Movie" ? "Mash ..." : "With ..."}
      </label>
      <button
        type="button"
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || !!error}
      >
        {isLoading ? (
          <span className="text-gray-500">Loading movies...</span>
        ) : error ? (
          <span className="text-red-500">Error loading movies</span>
        ) : selectedMovieObj ? (
          <div className="flex items-center">
            <img
              src={`https://image.tmdb.org/t/p/w500/${selectedMovieObj.photo}`}
              alt={selectedMovieObj.title}
              className="size-6 shrink-0 rounded-sm mr-2"
            />
            <span>{selectedMovieObj.title}</span>
          </div>
        ) : (
          <span className="text-gray-500">{label}</span>
        )}
        <ChevronDownIcon isOpen={isOpen} />
      </button>

      {isOpen && !isLoading && !error && (
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
                  <CheckIcon />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
