"use server";

import { RequestInfo } from "@redwoodjs/sdk/worker";
import MashupCreator from "@/app/pages/mashups/components/MashupCreator";
import { getMovies } from "@/app/pages/movies/functions";

export interface NewMashupParams {
  firstMovieId?: string;
  secondMovieId?: string;
}

export async function NewMashup({ params }: RequestInfo<NewMashupParams>) {
  const movies = await getMovies();

  return (
    <div className="w-full mx-auto">
      <MashupCreator
        firstMovieId={params.firstMovieId}
        secondMovieId={params.secondMovieId}
        movies={movies}
      />
    </div>
  );
}
