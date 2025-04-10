import { link } from "@/app/shared/links";
import type { Preset, Movie } from "@prisma/client";

type PresetWithMovies = Preset & {
  movie1: Pick<Movie, "id" | "title" | "photo">;
  movie2: Pick<Movie, "id" | "title" | "photo">;
};

interface PresetLinkProps {
  preset: PresetWithMovies;
}

export const PresetLink = ({ preset }: PresetLinkProps) => {
  return (
    <a
      key={preset.id}
      href={link(`/agents/mashup/:firstMovieId/:secondMovieId`, {
        firstMovieId: preset.movie1.id,
        secondMovieId: preset.movie2.id,
      })}
      className={`font-banner flex items-center gap-2 text-purple-600 hover:text-purple-800 bg-purple-100 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        preset.isFavorite ? "border-2 border-purple-500 shadow-sm" : ""
      }`}
    >
      <div className="flex -space-x-2">
        <img
          src={`https://image.tmdb.org/t/p/w92/${preset.movie1.photo}`}
          alt={preset.movie1.title}
          className="w-8 h-8 rounded-full border border-white"
        />
        <img
          src={`https://image.tmdb.org/t/p/w92/${preset.movie2.photo}`}
          alt={preset.movie2.title}
          className="w-8 h-8 rounded-full border border-white"
        />
      </div>
      <span className="flex-grow">
        {preset.movie1.title} + {preset.movie2.title}
      </span>
      {preset.isFavorite && (
        <span className="text-purple-500 flex-shrink-0" title="Favorite preset">
          ★
        </span>
      )}
    </a>
  );
};
