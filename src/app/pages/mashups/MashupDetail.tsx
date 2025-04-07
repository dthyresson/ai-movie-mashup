import type { Movie } from "@prisma/client";
import { MovieCard } from "./MovieCard";

interface MashupDetailProps {
  id: string;
  title: string;
  tagline: string;
  plot: string;
  imageDescription: string;
  audioKey: string;
  movie1: Movie;
  movie2: Movie;
}

export function MashupDetail({
  id,
  title,
  tagline,
  plot,
  imageDescription,
  audioKey,
  movie1,
  movie2,
}: MashupDetailProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">{title}</h1>
        <h2 className="text-xl italic text-gray-600 mb-4">"{tagline}"</h2>
        <div className="mb-8">
          <div className="flex flex-col items-center">
            <div className="aspect-square w-2xl rounded-lg overflow-hidden shadow-xl ">
              <img
                src={`/api/mashups/${id}/poster`}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-center text-gray-400 mt-2 max-w-lg">
              {imageDescription}
            </p>
          </div>
        </div>
        <p className="text-2xl text-gray-900 leading-relaxed max-w-2xl mx-auto text-left">
          {plot}
        </p>
        {audioKey && audioKey !== "" && (
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
        <MovieCard movie={movie1} />
        <MovieCard movie={movie2} />
      </div>
    </div>
  );
}
