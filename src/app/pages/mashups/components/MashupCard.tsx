import { link } from "@/app/shared/links";
interface Movie {
  id: string;
  title: string;
  photo: string;
}

interface MashupCardProps {
  id: string;
  title: string;
  tagline: string;
  plot: string;
  movie1: Movie;
  movie2: Movie;
}

export function MashupCard({
  id,
  title,
  tagline,
  plot,
  movie1,
  movie2,
}: MashupCardProps) {
  return (
    <div className="font-screenwriter bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:scale-105 hover:cursor-pointer">
      <a href={link("/mashups/:id", { id })} className="block">
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={`/api/mashups/${id}/poster`}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center p-4">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2 line-clamp-1">
            {title}
          </h2>
          <p className="text-lg italic text-gray-600 mb-2 line-clamp-1">
            {tagline}
          </p>
          <p className="text-gray-700 text-sm line-clamp-3 text-left">{plot}</p>
        </div>
      </a>
      <div className="mt-4 flex justify-between items-center p-4">
        <audio
          src={`/api/mashups/${id}/audio`}
          controls
          className="w-auto h-8"
          preload="none"
        />
        <div className="flex space-x-2">
          <span className="font-sans text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded text-center">
            <a href={link("/movies/:id", { id: movie1.id })}>{movie1.title}</a>
          </span>
          <span className="font-sans text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded text-center">
            <a href={link("/movies/:id", { id: movie2.id })}>{movie2.title}</a>
          </span>
        </div>
      </div>
    </div>
  );
}
