"use client";

import type { Movie } from "@prisma/client";
import { MovieCard } from "@/app/pages/movies/components/MovieCard";
import Spinner from "@/app/components/ui/Spinner";

interface MashupDetailProps {
  id: string;
  status: string;
  title: string;
  tagline: string;
  plot: string;
  imageDescription: string;
  movie1: Movie;
  movie2: Movie;
  audioKey: string;
}

export function MashupDetail({ id, status, ...props }: MashupDetailProps) {
  return (
    <div className="font-screenwriter w-full mx-auto p-6 bg-purple-50 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-800 mb-2">
          {props.title}
        </h1>
        <h2 className="text-2xl italic text-gray-600 mb-4">
          "{props.tagline}"
        </h2>
        {props.audioKey && props.audioKey !== "" && (
          <div className="mt-auto">
            <audio
              src={`/api/mashups/${id}/audio`}
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
          <div className="aspect-square rounded-lg overflow-hidden shadow-xl border-2 border-neutral-300">
            <img
              src={`/api/mashups/${id}/poster`}
              alt={props.title}
              className="w-full h-full object-cover rounded-lg p-2"
            />
          </div>
        </div>

        {/* Right column: Plot - takes up 3/5 */}
        <div className="lg:col-span-3 flex flex-col">
          <p className="text-xl text-gray-900 leading-relaxed mb-6">
            {props.plot}
          </p>
        </div>
      </div>

      <p className="text-md text-neutral-500 mt-4 w-full bg-purple-100 p-4 rounded-lg">
        {props.imageDescription}
      </p>

      <div className="max-w-3xl mx-auto mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <MovieCard movie={props.movie1} />
          <MovieCard movie={props.movie2} />
        </div>
      </div>
    </div>
  );
}
