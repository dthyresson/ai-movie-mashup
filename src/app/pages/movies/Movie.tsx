"use server";

import { getMovieWithMashups } from "./functions";
import type { Mashup, Movie as MovieType } from "@prisma/client";
import { Metadata } from "@/app/pages/mashups/components/Metadata";
import { link } from "@/app/shared/links";

type MashupWithMovies = Mashup & {
  movie1: MovieType;
  movie2: MovieType;
};

export async function Movie({ params }: { params: { id: string } }) {
  const movie = await getMovieWithMashups(params.id);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  // Combine mashups where this movie appears as either movie1 or movie2
  const allMashups = [
    ...movie.mashupsAsMovie1,
    ...movie.mashupsAsMovie2,
  ] as MashupWithMovies[];

  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;
  const title = `${movie.title} ${releaseYear ? `(${releaseYear})` : ""
    } Mashups`;

  return (
    <div className="container mx-auto px-4 py-8">
      <Metadata id={movie.id} title={title} tagline={movie.overview} />
      <div className="font-screenwriter w-full mx-auto p-4 sm:p-6 bg-purple-50 rounded-lg shadow-lg">
        {/* Movie Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
            {movie.title} {releaseYear && `(${releaseYear})`}
          </h1>
        </div>

        {/* Movie Details Layout */}
        <div className="flex flex-col md:flex-row mb-6 md:mb-8 md:space-x-8 space-y-6 md:space-y-0">
          {/* Left column: Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.photo}`}
            alt={movie.title}
            className="w-auto max-h-72 object-cover rounded-lg p-2 border-2 border-neutral-300"
          />


          {/* Right column: Overview */}
          <p className="text-lg md:text-xl text-gray-900 leading-relaxed">
            {movie.overview}
          </p>
        </div>

        {/* Mashups Section */}
        <div className="mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-banner font-bold">
              Mashups
            </h2>
            <a
              href={link("/mashups/new/:firstMovieId", {
                firstMovieId: movie.id,
              })}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-banner font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
            >
              <span>New Mashup</span>
              <span className="text-purple-200 ml-2 hidden sm:inline">
                with {movie.title}
              </span>
            </a>
          </div>

          {allMashups.length === 0 ? (
            <p className="font-banner text-center text-gray-500 text-lg sm:text-xl mt-8 sm:mt-12">
              No mashups found for this movie yet. Be the first to create one!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {allMashups.map((mashup: MashupWithMovies) => (
                <div
                  key={mashup.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square w-full">
                    <img
                      src={`/api/mashups/${mashup.id}/poster`}
                      alt={mashup.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                      <a href={link("/mashups/:id", { id: mashup.id })}>
                        {mashup.title}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 italic mb-3">
                      {mashup.tagline}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      {mashup.audioKey && (
                        <div className="w-full sm:flex-1">
                          <audio
                            src={`/api/mashups/${mashup.id}/audio`}
                            controls
                            className="w-full"
                          />
                        </div>
                      )}
                      <div className="font-banner text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded text-center">
                        <a
                          href={link("/movies/:id", {
                            id:
                              mashup.movie1Id === movie.id
                                ? mashup.movie2.id
                                : mashup.movie1.id,
                          })}
                        >
                          {mashup.movie1Id === movie.id
                            ? mashup.movie2.title
                            : mashup.movie1.title}
                        </a>
                      </div>
                    </div>

                    {mashup.status !== "COMPLETED" && (
                      <p className="mt-2 text-sm text-amber-600">
                        Status: {mashup.status}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
