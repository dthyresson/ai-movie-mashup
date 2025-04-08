"use client";

import { useEffect, useState } from "react";
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
  const [mashup, setMashup] = useState({ status, ...props });

  useEffect(() => {
    if (status === "PENDING") {
      const pollInterval = setInterval(async () => {
        const response = await fetch(`/api/mashups/${id}`);
        const data = (await response.json()) as {
          status: string;
          title: string;
          tagline: string;
          plot: string;
          imageDescription: string;
          movie1: Movie;
          movie2: Movie;
          audioKey: string;
        };

        if (data.status === "COMPLETED") {
          console.log("Mashup completed", data);
          setMashup(data);
          clearInterval(pollInterval);
        }
      }, 3_000); // Poll every 3 seconds

      return () => clearInterval(pollInterval);
    }
  }, [id, status]);

  if (mashup.status === "PENDING") {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4 space-y-8">
          I've queued your &quot;{mashup.movie1.title}&quot; and &quot;
          {mashup.movie2.title}&quot; AI movie mashup ...
        </h1>

        <h3 className="text-gray-700 text-lg">
          Please wait while I generate your unique movie mashup with a title,
          tagline, plot, poster, and audio.
        </h3>
        <p className="text-neutral-700 animate-pulse text-center mt-8">
          This usually takes about 30 seconds.
        </p>
        <div className="flex justify-center text-purple-700 my-8">
          <Spinner />
        </div>
      </div>
    );
  }

  if (mashup.status === "ERROR") {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">
          Error Creating Mashup
        </h1>
        <p className="text-gray-700">An unexpected error occurred</p>
      </div>
    );
  }

  return (
    <div className="font-screenwriter w-full mx-auto p-6 bg-purple-50 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-800 mb-2">
          {mashup.title}
        </h1>
        <h2 className="text-2xl italic text-gray-600 mb-4">
          "{mashup.tagline}"
        </h2>
        {mashup.audioKey && mashup.audioKey !== "" && (
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
              alt={mashup.title}
              className="w-full h-full object-cover rounded-lg p-2"
            />
          </div>
        </div>

        {/* Right column: Plot - takes up 3/5 */}
        <div className="lg:col-span-3 flex flex-col">
          <p className="text-xl text-gray-900 leading-relaxed mb-6">
            {mashup.plot}
          </p>
        </div>
      </div>

      <p className="text-md text-neutral-500 mt-4 w-full bg-purple-100 p-4 rounded-lg">
        {mashup.imageDescription}
      </p>

      <div className="max-w-3xl mx-auto mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <MovieCard movie={mashup.movie1} />
          <MovieCard movie={mashup.movie2} />
        </div>
      </div>
    </div>
  );
}
