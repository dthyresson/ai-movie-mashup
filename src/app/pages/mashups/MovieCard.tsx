import type { Movie } from "@prisma/client";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-64 w-full overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.photo}`}
          alt={movie.title}
          className="w-full h-full object-cover object-top rounded-lg"
        />
      </div>
      <p className="mt-2 text-lg font-bold text-gray-800">{movie.title}</p>
      <p className="mt-2 font-normal   text-gray-500">{movie.overview}</p>
    </div>
  );
}
