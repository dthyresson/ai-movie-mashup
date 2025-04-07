import { AppContext } from "@/worker";

import { NewMashupClient } from "@/app/pages/mashups/NewMashupClient";
import { getMovies } from "@/app/pages/movies/functions";

export async function NewMashup({ appContext }: { appContext: AppContext }) {
  const movies = await getMovies();
  return <NewMashupClient movies={movies} />;
}
