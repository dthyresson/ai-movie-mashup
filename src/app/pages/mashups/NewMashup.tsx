import type { AppContext } from "@/worker";
import type { RequestInfo } from "@redwoodjs/sdk/worker";

import { NewMashupClient } from "@/app/pages/mashups/NewMashupClient";
import { getMovies } from "@/app/pages/movies/functions";

export async function NewMashup({ ctx }: RequestInfo) {
  const movies = await getMovies();
  return <NewMashupClient movies={movies} />;
}
