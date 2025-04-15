"use server";

import { link } from "@/app/shared/links";
import { getMovies } from "./functions";

export async function Movies() {
  const movies = await getMovies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-banner font-bold">Movies</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {movies.map((movie) => (
          <a
            key={movie.id}
            href={link("/movies/:id", { id: movie.id })}
            className="overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105 flex flex-col"
          >
            <div className="aspect-auto w-full">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.photo}`}
                alt={movie.title}
                className="h-72 w-full object-cover"
              />
            </div>
            <div className="font-screenwriter p-4 flex flex-col flex-1">
              <h2 className="mb-2 text-xl text-gray-900 text-center">
                {movie.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3">
                {movie.overview}
              </p>
              {movie.releaseDate && (
                <p className="mt-auto pt-3 text-sm text-gray-500 text-right">
                  {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
