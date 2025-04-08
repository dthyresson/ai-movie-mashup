import { NewMashupClient } from "@/app/pages/mashups/components/NewMashupClient";
import { getMovies } from "@/app/pages/movies/functions";

export async function NewMashup() {
  const movies = await getMovies();
  return <NewMashupClient movies={movies} />;
}
