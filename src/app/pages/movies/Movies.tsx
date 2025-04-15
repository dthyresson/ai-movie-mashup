"use server";

import { link } from "@/app/shared/links";
import { getMovies } from "./functions";

export async function Movies() {
  const movies = await getMovies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-banner font-bold">Movies</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <a
            key={movie.id}
            href={link("/movies/:id", { id: movie.id })}
            className="block overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105"
          >
            <div className="aspect-[2/3] w-full">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.photo}`}
                alt={movie.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                {movie.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3">
                {movie.overview}
              </p>
              {movie.releaseDate && (
                <p className="mt-2 text-sm text-gray-500">
                  Released:{" "}
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
