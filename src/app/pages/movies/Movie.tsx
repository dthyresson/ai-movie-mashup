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
  const title = `${movie.title} ${
    releaseYear ? `(${releaseYear})` : ""
  } Mashups`;

  return (
    <div className="container mx-auto px-4 py-8">
      <Metadata id={movie.id} title={title} tagline={movie.overview} />
      <div className="font-screenwriter w-full mx-auto p-6 bg-purple-50 rounded-lg shadow-lg">
        {/* Movie Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 mb-2">
            {movie.title} {releaseYear && `(${releaseYear})`}
          </h1>
        </div>

        {/* Movie Details Layout */}
        <div className="flex flex-row mb-8 space-x-8">
          {/* Left column: Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.photo}`}
            alt={movie.title}
            className="w-auto h-72 object-fit rounded-lg p-2 border-2 border-neutral-300"
          />

          {/* Right column: Overview */}
          <p className="text-xl text-gray-900 leading-relaxed mb-6">
            {movie.overview}
          </p>
        </div>

        {/* Mashups Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-banner font-bold">Mashups</h2>
            <a
              href={link("/mashups/new/:firstMovieId", {
                firstMovieId: movie.id,
              })}
              className="inline-flex items-center px-6 py-3 text-lg font-banner font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
            >
              <span>New Mashup</span>
              <span className="text-purple-200 ml-2">with {movie.title}</span>
            </a>
          </div>

          {allMashups.length === 0 ? (
            <p className="font-banner text-center text-gray-500 text-xl mt-12">
              No mashups found for this movie yet. Be the first to create one!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      <a href={link("/mashups/:id", { id: mashup.id })}>
                        {mashup.title}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 italic mb-3">
                      {mashup.tagline}
                    </p>
                    <div className="flex justify-between items-center space-x-2">
                      {mashup.audioKey && (
                        <div className="mt-3">
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
    </div>
  );
}
