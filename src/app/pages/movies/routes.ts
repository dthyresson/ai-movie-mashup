import { route } from "@redwoodjs/sdk/router";
import { Movies } from "./Movies";
import { Movie } from "./Movie";

export const movieRoutes = [route("/", Movies), route("/:id", Movie)];
