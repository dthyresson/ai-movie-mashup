import type { Movie } from "@prisma/client";
import { link } from "@/app/shared/links";

export function MovieCard({ movie }: { movie: Movie }) {
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <a
      href={link("/movies/:id", { id: movie.id })}
      className=" font-screenwriter flex flex-col items-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="h-64 w-full overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.photo}`}
          alt={movie.title}
          className="w-full h-full object-cover object-top rounded-lg"
        />
      </div>
      <div className="p-4">
        <p className="mt-2 text-xl font-bold text-gray-800">
          {movie.title} {releaseYear && `(${releaseYear})`}
        </p>
        <p className="mt-2 font-normal text-sm text-gray-500">
          {movie.overview}
        </p>
      </div>
    </a>
  );
}
