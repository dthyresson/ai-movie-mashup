"use client";

import { useEffect, useState } from "react";
import type { Movie } from "@prisma/client";
import { MovieCard } from "./MovieCard";
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
        <p className="text-gray-700 animate-pulse text-center">
          This usually takes about 30 seconds.
        </p>
        <div className="flex justify-center text-neutral-700 my-8">
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          {mashup.title}
        </h1>
        <h2 className="text-xl italic text-gray-600 mb-4">
          "{mashup.tagline}"
        </h2>
        <div className="mb-8">
          <div className="flex flex-col items-center">
            <div className="aspect-square w-2xl rounded-lg overflow-hidden shadow-xl ">
              <img
                src={`/api/mashups/${id}/poster`}
                alt={mashup.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-center text-gray-400 mt-2 max-w-lg">
              {mashup.imageDescription}
            </p>
          </div>
        </div>
        <p className="text-2xl text-gray-900 leading-relaxed max-w-2xl mx-auto text-left">
          {mashup.plot}
        </p>
        {mashup.audioKey && mashup.audioKey !== "" && (
          <div className="my-4 flex justify-center ">
            <audio
              src={`/api/mashups/${id}/audio`}
              controls
              className="w-full max-w-2xl"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <MovieCard movie={mashup.movie1} />
        <MovieCard movie={mashup.movie2} />
      </div>
    </div>
  );
}
